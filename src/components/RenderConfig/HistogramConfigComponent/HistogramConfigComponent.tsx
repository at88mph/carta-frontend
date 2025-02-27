import * as React from "react";
import {Alert, Button, FormGroup, MenuItem} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import {makeObservable, observable} from "mobx";
import {observer} from "mobx-react";

import {SCALING_POPOVER_PROPS} from "components/Shared";
import {AppStore} from "stores";
import {RenderConfigStore} from "stores/Frame";

const HistogramSelect = Select.ofType<boolean>();

interface HistogramConfigProps {
    renderConfig: RenderConfigStore;
    onCubeHistogramSelected: () => void;
    onCubeHistogramCancelled?: () => void;
    darkTheme: boolean;
    warnOnCubeHistogram: boolean;
    showHistogramSelect: boolean;
    disableHistogramSelect: boolean;
}

@observer
export class HistogramConfigComponent extends React.Component<HistogramConfigProps> {
    @observable showCubeHistogramAlert: boolean;

    constructor(props: any) {
        super(props);
        makeObservable(this);
    }

    renderHistogramSelectItem = (isCube: boolean, {handleClick, modifiers, query}) => {
        return <MenuItem text={isCube ? "Per-cube" : "Per-channel"} onClick={handleClick} key={isCube ? "cube" : "channel"} />;
    };

    handleHistogramChange = (value: boolean) => {
        if (value && !this.props.renderConfig.cubeHistogram) {
            if (this.props.warnOnCubeHistogram) {
                this.showCubeHistogramAlert = true;
            } else {
                this.handleAlertConfirm();
            }
        } else {
            this.props.renderConfig.setUseCubeHistogram(value);
        }
    };

    render() {
        if (!this.props.renderConfig) {
            return null;
        }

        const renderConfig = this.props.renderConfig;
        return (
            <React.Fragment>
                {this.props.showHistogramSelect && (
                    <FormGroup label={"Histogram"} inline={true} disabled={this.props.disableHistogramSelect}>
                        <HistogramSelect
                            activeItem={renderConfig.useCubeHistogram}
                            popoverProps={SCALING_POPOVER_PROPS}
                            filterable={false}
                            items={[true, false]}
                            onItemSelect={this.handleHistogramChange}
                            itemRenderer={this.renderHistogramSelectItem}
                            disabled={this.props.disableHistogramSelect}
                        >
                            <Button text={renderConfig.useCubeHistogram ? "Per-cube" : "Per-channel"} rightIcon="double-caret-vertical" alignText={"right"} disabled={this.props.disableHistogramSelect} />
                        </HistogramSelect>
                    </FormGroup>
                )}
                <Alert className={AppStore.Instance.darkTheme ? "bp3-dark" : ""} icon={"time"} isOpen={this.showCubeHistogramAlert} onCancel={this.handleAlertCancel} onConfirm={this.handleAlertConfirm} cancelButtonText={"Cancel"}>
                    <p>Calculating a cube histogram may take a long time, depending on the size of the file. Are you sure you want to continue?</p>
                </Alert>
            </React.Fragment>
        );
    }

    private handleAlertConfirm = () => {
        this.props.onCubeHistogramSelected();
        this.showCubeHistogramAlert = false;
    };

    private handleAlertCancel = () => {
        this.showCubeHistogramAlert = false;
    };
}
