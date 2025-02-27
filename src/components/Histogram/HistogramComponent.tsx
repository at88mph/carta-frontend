import * as React from "react";
import ReactResizeDetector from "react-resize-detector";
import {NonIdealState} from "@blueprintjs/core";
import {CARTA} from "carta-protobuf";
import classNames from "classnames";
import * as _ from "lodash";
import {action, autorun, computed, makeObservable, observable} from "mobx";
import {observer} from "mobx-react";

import {LinePlotComponent, LinePlotComponentProps, ProfilerInfoComponent} from "components/Shared";
import {Point2D, POLARIZATIONS} from "models";
import {AppStore, DefaultWidgetConfig, HelpType, WidgetProps, WidgetsStore} from "stores";
import {FrameStore} from "stores/Frame";
import {HistogramWidgetStore} from "stores/Widgets";
import {binarySearchByX, clamp, closeTo, getColorForTheme, toExponential, toFixed} from "utilities";

import {TickType} from "../Shared/LinePlot/PlotContainer/PlotContainerComponent";

import {HistogramToolbarComponent} from "./HistogramToolbarComponent/HistogramToolbarComponent";

import "./HistogramComponent.scss";

@observer
export class HistogramComponent extends React.Component<WidgetProps> {
    public static get WIDGET_CONFIG(): DefaultWidgetConfig {
        return {
            id: "histogram",
            type: "histogram",
            minWidth: 400,
            minHeight: 225,
            defaultWidth: 650,
            defaultHeight: 225,
            title: "Histogram",
            isCloseable: true,
            helpType: HelpType.HISTOGRAM
        };
    }

    private cachedFrame: FrameStore;
    private currentLinePlotProps: LinePlotComponentProps;

    @observable width: number;
    @observable height: number;

    @computed get widgetStore(): HistogramWidgetStore {
        const widgetsStore = WidgetsStore.Instance;
        if (widgetsStore.histogramWidgets) {
            const widgetStore = widgetsStore.histogramWidgets.get(this.props.id);
            if (widgetStore) {
                return widgetStore;
            }
        }
        console.log("can't find store for widget");
        return new HistogramWidgetStore();
    }

    @computed get isTargetData(): boolean {
        const regionHistogramData = this.getRegionHistogramData();
        if (!regionHistogramData) {
            return false;
        }

        // Check whether the histogram data matches the widget's configuration
        if (regionHistogramData.config.fixedNumBins !== this.widgetStore.fixedNumBins || regionHistogramData.config.fixedBounds !== this.widgetStore.fixedBounds) {
            return false;
        }
        if (regionHistogramData.config.fixedNumBins && regionHistogramData.config.numBins !== this.widgetStore.numBins) {
            return false;
        }
        return !regionHistogramData.config.fixedBounds || (closeTo(regionHistogramData.config.bounds.min, this.widgetStore.minPix) && closeTo(regionHistogramData.config.bounds.max, this.widgetStore.maxPix));
    }

    @computed get histogramData(): CARTA.IHistogram {
        const regionHistogramData = this.getRegionHistogramData();
        return regionHistogramData ? regionHistogramData.histograms : null;
    }

    @computed get plotData(): {values: Array<Point2D>; xMin: number; xMax: number; yMin: number; yMax: number} {
        const histogram = this.histogramData;
        if (histogram) {
            let minIndex = 0;
            let maxIndex = histogram.bins.length - 1;

            // Truncate array if zoomed in (sidestepping ChartJS bug with off-canvas rendering and speeding up layout)
            if (!this.widgetStore.isAutoScaledX) {
                minIndex = Math.floor((this.widgetStore.minX - histogram.firstBinCenter) / histogram.binWidth);
                minIndex = clamp(minIndex, 0, histogram.bins.length - 1);
                maxIndex = Math.ceil((this.widgetStore.maxX - histogram.firstBinCenter) / histogram.binWidth);
                maxIndex = clamp(maxIndex, 0, histogram.bins.length - 1);
            }

            let xMin = histogram.firstBinCenter + histogram.binWidth * minIndex;
            let xMax = histogram.firstBinCenter + histogram.binWidth * maxIndex;
            let yMin = histogram.bins[minIndex];
            let yMax = yMin;

            // Cache automatic settings for histogram min and max values
            if (this.widgetStore.currentAutoBounds) {
                this.widgetStore.cacheBounds(xMin, xMax);
                this.widgetStore.resetBounds();
            }

            // Cache automatic setting for the number of histogram bins
            if (this.widgetStore.currentAutoBins) {
                this.widgetStore.cacheNumBins(histogram.bins.length);
                this.widgetStore.resetNumBins();
            }

            let values: Array<{x: number; y: number}>;
            const N = maxIndex - minIndex;
            if (N > 0 && !isNaN(N)) {
                values = new Array(maxIndex - minIndex);

                for (let i = minIndex; i <= maxIndex; i++) {
                    values[i - minIndex] = {x: histogram.firstBinCenter + histogram.binWidth * i, y: histogram.bins[i]};
                    yMin = Math.min(yMin, histogram.bins[i]);
                    yMax = Math.max(yMax, histogram.bins[i]);
                }
            }
            return {values, xMin, xMax, yMin, yMax};
        }
        return null;
    }

    @computed get exportHeaders(): string[] {
        let headerString = [];

        // region info
        const frame = this.widgetStore.effectiveFrame;
        if (frame && frame.frameInfo && frame.regionSet) {
            const regionId = this.widgetStore.effectiveRegionId;
            const region = frame.regionSet.regions.find(r => r.regionId === regionId);
            if (region) {
                headerString.push(region.regionProperties);
            }
        }

        return headerString;
    }

    constructor(props: WidgetProps) {
        super(props);
        makeObservable(this);

        const appStore = AppStore.Instance;
        // Check if this widget hasn't been assigned an ID yet
        if (!props.docked && props.id === HistogramComponent.WIDGET_CONFIG.type) {
            // Assign the next unique ID
            const id = appStore.widgetsStore.addHistogramWidget();
            appStore.widgetsStore.changeWidgetId(props.id, id);
        } else {
            if (!appStore.widgetsStore.histogramWidgets.has(this.props.id)) {
                console.log(`can't find store for widget with id=${this.props.id}`);
                appStore.widgetsStore.histogramWidgets.set(this.props.id, new HistogramWidgetStore());
            }
        }
        // Update widget title when region or coordinate changes
        autorun(() => {
            if (this.widgetStore && this.widgetStore.effectiveFrame) {
                let regionString = "Unknown";
                const regionId = this.widgetStore.effectiveRegionId;

                if (regionId === -1) {
                    regionString = "Image";
                } else if (this.widgetStore.effectiveFrame.regionSet) {
                    const region = this.widgetStore.effectiveFrame.regionSet.regions.find(r => r.regionId === regionId);
                    if (region) {
                        regionString = region.nameString;
                    }
                }
                const selectedString = this.widgetStore.matchesSelectedRegion ? "(Active)" : "";
                appStore.widgetsStore.setWidgetTitle(this.props.id, `Histogram: ${regionString} ${selectedString}`);
            } else {
                appStore.widgetsStore.setWidgetTitle(this.props.id, `Histogram`);
            }
            const widgetStore = this.widgetStore;
            if (widgetStore) {
                const currentData = this.plotData;
                if (currentData) {
                    widgetStore.initXYBoundaries(currentData.xMin, currentData.xMax, currentData.yMin, currentData.yMax);
                }
            }
        });
    }

    componentDidUpdate() {
        const frame = this.widgetStore.effectiveFrame;

        if (frame !== this.cachedFrame) {
            this.cachedFrame = frame;
            this.widgetStore.clearXYBounds();
        }
    }

    @action onResize = (width: number, height: number) => {
        this.width = width;
        this.height = height;
    };

    onGraphCursorMoved = _.throttle(x => {
        this.widgetStore.setCursor(x);
    }, 100);

    private genProfilerInfo = (unit: string): string[] => {
        let profilerInfo: string[] = [];
        if (this.plotData) {
            if (this.widgetStore.isMouseMoveIntoLinePlots) {
                const nearest = binarySearchByX(this.plotData.values, this.widgetStore.cursorX);
                if (nearest?.point) {
                    let xValueLabel = Math.abs(nearest.point.x) < 1e-5 ? toExponential(nearest.point.x, 5) : toFixed(nearest.point.x, 5);
                    let yValueLabel = `${nearest.point.y !== 0.5 ? nearest.point.y : 0}`;
                    if (unit) {
                        xValueLabel += ` ${unit}`;
                    }
                    if (nearest.point.y <= 1) {
                        yValueLabel += ` Count`;
                    } else {
                        yValueLabel += ` Counts`;
                    }
                    if (this.widgetStore.cursorX > this.plotData.xMax || this.widgetStore.cursorX < this.plotData.xMin) {
                        xValueLabel = `NaN`;
                        yValueLabel = `NaN`;
                    }
                    profilerInfo.push(`Cursor: ${xValueLabel}, ${yValueLabel}`);
                }
            }
        }
        return profilerInfo;
    };

    private getRegionHistogramData = (): CARTA.IRegionHistogramData => {
        if (!this.widgetStore.effectiveFrame) {
            return null;
        }

        const fileId = this.widgetStore.effectiveFrame.frameInfo.fileId;
        const regionId = this.widgetStore.effectiveRegionId;
        const coordinate = this.widgetStore.coordinate;
        const appStore = AppStore.Instance;

        const frameMap = appStore.regionHistograms.get(fileId);
        if (!frameMap) {
            return null;
        }

        const regionMap = frameMap.get(regionId);
        if (!regionMap) {
            return null;
        }

        const stokesIndex = this.widgetStore.effectiveFrame.polarizationInfo.findIndex(polarization => polarization.replace("Stokes ", "") === coordinate.slice(0, coordinate.length - 1));
        const stokes = stokesIndex >= this.widgetStore.effectiveFrame.frameInfo.fileInfoExtended.stokes ? this.widgetStore.effectiveFrame.polarizations[stokesIndex] : stokesIndex;
        const regionHistogramData = regionMap.get(stokes === -1 ? this.widgetStore.effectiveFrame.requiredStokes : stokes);

        return regionHistogramData ? regionHistogramData : null;
    };

    render() {
        const appStore = AppStore.Instance;
        const frame = this.widgetStore.effectiveFrame;

        if (!frame || !this.widgetStore) {
            return (
                <div className="histogram-widget">
                    <NonIdealState icon={"folder-open"} title={"No file loaded"} description={"Load a file using the menu"} />
                </div>
            );
        }

        let unit = "";
        if (frame && frame.headerUnit) {
            if ([POLARIZATIONS.PFtotal, POLARIZATIONS.PFlinear].includes(this.widgetStore.effectivePolarization)) {
                unit = "%";
            } else if (this.widgetStore.effectivePolarization === POLARIZATIONS.Pangle) {
                unit = "degree";
            } else {
                unit = frame.headerUnit;
            }
        }

        const imageName = frame.filename;
        const plotName = `channel ${frame.channel} histogram`;

        if (this.isTargetData || !this.currentLinePlotProps) {
            let linePlotProps: LinePlotComponentProps = {
                xLabel: unit ? `Value (${unit})` : "Value",
                yLabel: "Count",
                darkMode: appStore.darkTheme,
                imageName: imageName,
                plotName: plotName,
                logY: this.widgetStore.logScaleY,
                plotType: this.widgetStore.plotType,
                tickTypeY: TickType.Scientific,
                graphZoomedX: this.widgetStore.setXBounds,
                graphZoomedY: this.widgetStore.setYBounds,
                graphZoomedXY: this.widgetStore.setXYBounds,
                graphZoomReset: this.widgetStore.clearXYBounds,
                graphCursorMoved: this.onGraphCursorMoved,
                scrollZoom: true,
                mouseEntered: this.widgetStore.setMouseMoveIntoLinePlots,
                borderWidth: this.widgetStore.lineWidth,
                pointRadius: this.widgetStore.linePlotPointSize,
                zeroLineWidth: 2
            };

            if (frame.renderConfig.histogram && frame.renderConfig.histogram.bins && frame.renderConfig.histogram.bins.length) {
                const currentPlotData = this.plotData;
                if (currentPlotData) {
                    linePlotProps.data = currentPlotData.values;

                    // set line color
                    linePlotProps.lineColor = getColorForTheme(this.widgetStore.primaryLineColor);

                    // Determine scale in X and Y directions. If auto-scaling, use the bounds of the current data
                    if (this.widgetStore.isAutoScaledX) {
                        linePlotProps.xMin = currentPlotData.xMin;
                        linePlotProps.xMax = currentPlotData.xMax;
                    } else {
                        linePlotProps.xMin = this.widgetStore.minX;
                        linePlotProps.xMax = this.widgetStore.maxX;
                    }

                    if (this.widgetStore.isAutoScaledY) {
                        linePlotProps.yMin = currentPlotData.yMin;
                        linePlotProps.yMax = currentPlotData.yMax;
                    } else {
                        linePlotProps.yMin = this.widgetStore.minY;
                        linePlotProps.yMax = this.widgetStore.maxY;
                    }
                    // Fix log plot min bounds for entries with zeros in them
                    if (this.widgetStore.logScaleY && linePlotProps.yMin <= 0) {
                        linePlotProps.yMin = 0.5;
                    }
                }

                linePlotProps.comments = this.exportHeaders;
            }

            this.currentLinePlotProps = linePlotProps;
        }

        const className = classNames("histogram-widget", {"bp3-dark": appStore.darkTheme});

        return (
            <div className={className}>
                <div className="histogram-container">
                    <HistogramToolbarComponent widgetStore={this.widgetStore} />
                    <div className="histogram-plot">
                        <LinePlotComponent {...this.currentLinePlotProps} />
                    </div>
                    <div>
                        <ProfilerInfoComponent info={this.genProfilerInfo(unit)} />
                    </div>
                </div>
                <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} refreshMode={"throttle"}></ReactResizeDetector>
            </div>
        );
    }
}
