import * as React from "react";
import {observer} from "mobx-react";
import {FrameStore, OverlayStore, PreferenceStore, RasterRenderType} from "stores";
import {FrameView, Point2D, TileCoordinate} from "models";
import {RasterTile, TILE_SIZE, TileService} from "services/TileService";
import {GetRequiredTiles, GL, LayerToMip, loadFP32Texture, hexStringToRgba, add2D, scale2D} from "utilities";
import "./RasterViewComponent.css";

export class RasterViewComponentProps {
    preference: PreferenceStore;
    overlaySettings: OverlayStore;
    frame: FrameStore;
    tileService: TileService;
    docked: boolean;
}

@observer
export class RasterViewComponent extends React.Component<RasterViewComponentProps> {
    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;

    componentDidMount() {
        this.gl = this.props.tileService.tileWebGLService.gl;
        if (this.canvas) {
            this.updateCanvas();
        }
        this.props.tileService.tileStream.subscribe(() => requestAnimationFrame(this.updateCanvas));
    }

    componentDidUpdate() {
        requestAnimationFrame(this.updateCanvas);
    }

    private updateCanvas = () => {
        const frame = this.props.frame;
        const tileRenderService = this.props.tileService.tileWebGLService;
        if (frame && this.canvas && this.gl && tileRenderService.cmapTexture) {
            if (frame.renderType === RasterRenderType.ANIMATION && frame.rasterData && frame.rasterData.buffer !== tileRenderService.rasterDataBuffer) {
                this.updateTexture();
            }

            this.updateCanvasSize();
            this.updateUniforms();
            this.renderCanvas();
            // draw in 2d canvas
            const ctx = this.canvas.getContext("2d");
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.drawImage(this.gl.canvas, 0, 0, this.canvas.width, this.canvas.height);
        }
    };

    private updateTexture() {
        const tileRenderService = this.props.tileService.tileWebGLService;
        const frame = this.props.frame;
        const w = Math.ceil((frame.currentFrameView.xMax - frame.currentFrameView.xMin) / frame.currentFrameView.mip);
        const h = Math.ceil((frame.currentFrameView.yMax - frame.currentFrameView.yMin) / frame.currentFrameView.mip);
        if (!frame.rasterData || frame.rasterData.length !== w * h) {
            console.log(`Data mismatch! L=${frame.rasterData ? frame.rasterData.length : "null"}, WxH = ${w}x${h}=${w * h}`);
            return;
        } else {
            this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, tileRenderService.animationDataTexture);
            loadFP32Texture(this.gl, frame.rasterData, w, h, w, h, WebGLRenderingContext.TEXTURE0);
            tileRenderService.rasterDataBuffer = frame.rasterData.buffer;
        }
    }

    private updateUniforms() {
        const tileRenderService = this.props.tileService.tileWebGLService;
        const frame = this.props.frame;
        const renderConfig = frame.renderConfig;
        const preference = this.props.preference;
        if (renderConfig && preference && tileRenderService.shaderUniforms) {
            this.gl.uniform1f(tileRenderService.shaderUniforms.MinVal, renderConfig.scaleMinVal);
            this.gl.uniform1f(tileRenderService.shaderUniforms.MaxVal, renderConfig.scaleMaxVal);
            this.gl.uniform1i(tileRenderService.shaderUniforms.CmapIndex, renderConfig.colorMap);
            this.gl.uniform1i(tileRenderService.shaderUniforms.ScaleType, renderConfig.scaling);
            this.gl.uniform1i(tileRenderService.shaderUniforms.Inverted, renderConfig.inverted ? 1 : 0);
            this.gl.uniform1f(tileRenderService.shaderUniforms.Bias, renderConfig.bias);
            this.gl.uniform1f(tileRenderService.shaderUniforms.Contrast, renderConfig.contrast);
            this.gl.uniform1f(tileRenderService.shaderUniforms.Gamma, renderConfig.gamma);
            this.gl.uniform1f(tileRenderService.shaderUniforms.Alpha, renderConfig.alpha);
            this.gl.uniform1f(tileRenderService.shaderUniforms.CanvasWidth, frame.renderWidth * devicePixelRatio);
            this.gl.uniform1f(tileRenderService.shaderUniforms.CanvasHeight, frame.renderHeight * devicePixelRatio);

            const rgba = hexStringToRgba(preference.nanColorHex, preference.nanAlpha);
            if (rgba) {
                this.gl.uniform4f(tileRenderService.shaderUniforms.NaNColor, rgba.r / 255, rgba.g / 255, rgba.b / 255, rgba.a);
            }
        }
    }

    private updateCanvasSize() {
        const frame = this.props.frame;
        const tileRenderService = this.props.tileService.tileWebGLService;

        // Resize and clear the canvas if needed
        if (frame && frame.isRenderable && (this.canvas.width !== frame.renderWidth * devicePixelRatio || this.canvas.height !== frame.renderHeight * devicePixelRatio)) {
            this.canvas.width = frame.renderWidth * devicePixelRatio;
            this.canvas.height = frame.renderHeight * devicePixelRatio;
            tileRenderService.setCanvasSize(frame.renderWidth * devicePixelRatio, frame.renderHeight * devicePixelRatio);
        }
    }

    private renderCanvas() {
        const frame = this.props.frame;
        // Only clear and render if we're in animation or tiled mode
        if (frame && frame.isRenderable && frame.renderType !== RasterRenderType.NONE) {
            this.gl.viewport(0, 0, frame.renderWidth * devicePixelRatio, frame.renderHeight * devicePixelRatio);
            this.gl.enable(WebGLRenderingContext.DEPTH_TEST);
            this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);

            // Skip rendering if frame is hidden
            if (!frame.renderConfig.visible) {
                return;
            }
            if (frame.renderType === RasterRenderType.TILED) {
                this.renderTiledCanvas();
            } else {
                this.renderAnimationCanvas();
            }
        }
    }

    private renderAnimationCanvas() {
        const frame = this.props.frame;
        const tileRenderService = this.props.tileService.tileWebGLService;

        const current = frame.currentFrameView;
        const full = frame.requiredFrameView;
        const fullWidth = full.xMax - full.xMin;
        const fullHeight = full.yMax - full.yMin;

        // Bounds need to be adjusted because of MIP level
        const adjustedXMax = current.xMin + Math.ceil((current.xMax - current.xMin) / current.mip) * current.mip;
        const adjustedYMax = current.yMin + Math.ceil((current.yMax - current.yMin) / current.mip) * current.mip;

        const LT = {x: (0.5 + current.xMin - full.xMin) / fullWidth, y: (0.5 + current.yMin - full.yMin) / fullHeight};
        const RB = {x: (0.5 + adjustedXMax - full.xMin) / fullWidth, y: (0.5 + adjustedYMax - full.yMin) / fullHeight};

        // Vertices are mapped from [0-1] -> [-1, 1]
        const vertices = new Float32Array([
            LT.x, LT.y, 0,
            RB.x, LT.y, 0,
            LT.x, RB.y, 0,
            RB.x, RB.y, 0
        ].map(v => -1 + 2 * v));

        this.gl.activeTexture(WebGLRenderingContext.TEXTURE0);
        this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, tileRenderService.animationDataTexture);
        this.gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, tileRenderService.vertexUVBuffer);
        this.gl.vertexAttribPointer(tileRenderService.vertexUVAttribute, 2, WebGLRenderingContext.FLOAT, false, 0, 0);
        this.gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, tileRenderService.animationVertexPositionBuffer);
        this.gl.vertexAttribPointer(tileRenderService.vertexPositionAttribute, 3, WebGLRenderingContext.FLOAT, false, 0, 0);
        this.gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, new Float32Array(vertices), WebGLRenderingContext.DYNAMIC_DRAW);
        this.gl.uniform1i(tileRenderService.shaderUniforms.TiledRendering, 0);
        this.gl.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, 4);
    }

    private renderTiledCanvas() {
        const frame = this.props.frame;
        const tileRenderService = this.props.tileService.tileWebGLService;

        this.gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, tileRenderService.vertexUVBuffer);
        this.gl.vertexAttribPointer(tileRenderService.vertexUVAttribute, 2, WebGLRenderingContext.FLOAT, false, 0, 0);
        this.gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, tileRenderService.vertexPositionBuffer);
        this.gl.vertexAttribPointer(tileRenderService.vertexPositionAttribute, 3, WebGLRenderingContext.FLOAT, false, 0, 0);
        this.gl.uniform1i(tileRenderService.shaderUniforms.TiledRendering, 1);

        const imageSize = {x: frame.frameInfo.fileInfoExtended.width, y: frame.frameInfo.fileInfoExtended.height};
        const boundedView: FrameView = {
            xMin: Math.max(0, frame.requiredFrameView.xMin),
            xMax: Math.min(frame.requiredFrameView.xMax, imageSize.x),
            yMin: Math.max(0, frame.requiredFrameView.yMin),
            yMax: Math.min(frame.requiredFrameView.yMax, imageSize.y),
            mip: frame.requiredFrameView.mip
        };

        this.gl.activeTexture(WebGLRenderingContext.TEXTURE0);
        const requiredTiles = GetRequiredTiles(boundedView, imageSize, {x: TILE_SIZE, y: TILE_SIZE});
        // Special case when zoomed out
        if (requiredTiles.length === 1 && requiredTiles[0].layer === 0) {
            const mip = LayerToMip(0, imageSize, {x: TILE_SIZE, y: TILE_SIZE});
            this.renderTiles(requiredTiles, mip, false, 3, true);
        } else {
            this.renderTiles(requiredTiles, boundedView.mip, false, 3, true);
        }
    }

    private renderTiles(tiles: TileCoordinate[], mip: number, peek: boolean = false, numPlaceholderLayersHighRes: number, renderLowRes: boolean) {
        const tileService = this.props.tileService;
        const frame = this.props.frame;

        if (!tileService) {
            return;
        }

        const placeholderTileMap = new Map<number, boolean>();
        const highResPlaceholders = [];

        for (const tile of tiles) {
            const encodedCoordinate = TileCoordinate.EncodeCoordinate(tile);
            const rasterTile = tileService.getTile(encodedCoordinate, frame.frameInfo.fileId, frame.channel, frame.stokes, peek);
            if (rasterTile) {
                this.renderTile(tile, rasterTile, mip);
            } else {
                // Add high-res placeholders
                if (numPlaceholderLayersHighRes > 0 && mip >= 2) {
                    highResPlaceholders.push({
                        layer: tile.layer + 1,
                        x: tile.x * 2,
                        y: tile.y * 2,
                    });
                    highResPlaceholders.push({
                        layer: tile.layer + 1,
                        x: tile.x * 2 + 1,
                        y: tile.y * 2,
                    });
                    highResPlaceholders.push({
                        layer: tile.layer + 1,
                        x: tile.x * 2,
                        y: tile.y * 2 + 1,
                    });
                    highResPlaceholders.push({
                        layer: tile.layer + 1,
                        x: tile.x * 2 + 1,
                        y: tile.y * 2 + 1,
                    });
                }

                // Add low-res placeholders
                if (tile.layer > 0 && renderLowRes) {
                    const lowResTile = {
                        layer: tile.layer - 1,
                        x: Math.floor(tile.x / 2.0),
                        y: Math.floor(tile.y / 2.0),
                    };
                    placeholderTileMap.set(TileCoordinate.EncodeCoordinate(lowResTile), true);
                }
            }
        }

        // Render remaining placeholders
        if (numPlaceholderLayersHighRes > 0 && highResPlaceholders.length) {
            this.renderTiles(highResPlaceholders, mip / 2, true, numPlaceholderLayersHighRes - 1, false);
        }
        if (renderLowRes) {
            const placeholderTileList: TileCoordinate[] = [];
            placeholderTileMap.forEach((val, encodedTile) => placeholderTileList.push(TileCoordinate.Decode(encodedTile)));
            if (placeholderTileList.length) {
                this.renderTiles(placeholderTileList, mip * 2, true, 0, true);
            }
        }
    }

    private renderTile(tile: TileCoordinate, rasterTile: RasterTile, mip: number) {
        const frame = this.props.frame;
        const tileRenderService = this.props.tileService.tileWebGLService;

        if (!rasterTile) {
            return;
        }

        if (rasterTile.data) {
            this.props.tileService.uploadTileToGPU(rasterTile);
            delete rasterTile.data;
        }

        const textureParameters = this.props.tileService.getTileTextureParameters(rasterTile);
        if (textureParameters) {
            this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, textureParameters.texture);
            this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, GL.NEAREST);
            this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, GL.NEAREST);
            this.gl.uniform2f(tileRenderService.shaderUniforms.TileTextureOffset, textureParameters.offset.x, textureParameters.offset.y);
        }

        const spatialRef = frame.spatialReference || frame;
        const full = spatialRef.requiredFrameView;

        const tileSizeAdjusted = mip * TILE_SIZE;
        const tileImageView: FrameView = {
            xMin: tile.x * tileSizeAdjusted,
            yMin: tile.y * tileSizeAdjusted,
            xMax: (tile.x + 1) * tileSizeAdjusted,
            yMax: (tile.y + 1) * tileSizeAdjusted,
            mip: 1
        };

        let bottomLeft = {x: (0.5 + tileImageView.xMin - full.xMin), y: (0.5 + tileImageView.yMin - full.yMin)};
        let tileScaling = scale2D({x: 1, y: 1}, mip * spatialRef.zoomLevel);

        // Experimental code to handle WCS spatial transforms
        if (frame.spatialReference && frame.spatialTransform) {
            bottomLeft = add2D(bottomLeft, frame.spatialTransform.translation);
            // set origin of rotation to image center
            const rotationOriginImageSpace: Point2D = add2D(frame.spatialTransform.origin, frame.spatialTransform.translation);
            const rotationOriginCanvasSpace: Point2D = {
                x: spatialRef.zoomLevel * (rotationOriginImageSpace.x - full.xMin),
                y: spatialRef.zoomLevel * (rotationOriginImageSpace.y - full.yMin),
            };
            this.gl.uniform2f(tileRenderService.shaderUniforms.RotationOrigin, rotationOriginCanvasSpace.x, rotationOriginCanvasSpace.y);
            this.gl.uniform1f(tileRenderService.shaderUniforms.RotationAngle, -frame.spatialTransform.rotation);
            this.gl.uniform1f(tileRenderService.shaderUniforms.ScaleAdjustment, frame.spatialTransform.scale);
        } else {
            this.gl.uniform1f(tileRenderService.shaderUniforms.RotationAngle, 0);
            this.gl.uniform1f(tileRenderService.shaderUniforms.ScaleAdjustment, 1);
        }

        // take zoom level into account to convert from image space to canvas space
        bottomLeft = scale2D(bottomLeft, spatialRef.zoomLevel);

        this.gl.uniform2f(tileRenderService.shaderUniforms.TileSize, rasterTile.width, rasterTile.height);
        this.gl.uniform2f(tileRenderService.shaderUniforms.TileOffset, bottomLeft.x, bottomLeft.y);
        this.gl.uniform2f(tileRenderService.shaderUniforms.TileScaling, tileScaling.x, tileScaling.y);
        this.gl.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, 4);
    }

    render() {
        // dummy values to trigger React's componentDidUpdate()
        const frame = this.props.frame;
        const preference = this.props.preference;
        if (frame) {
            const spatialReference = frame.spatialReference || frame;
            const frameView = spatialReference.requiredFrameView;
            const currentView = spatialReference.currentFrameView;
            const renderType = frame.renderType;

            const colorMapping = {
                min: frame.renderConfig.scaleMinVal,
                max: frame.renderConfig.scaleMaxVal,
                colorMap: frame.renderConfig.colorMap,
                contrast: frame.renderConfig.contrast,
                bias: frame.renderConfig.bias,
                scaling: frame.renderConfig.scaling,
                gamma: frame.renderConfig.gamma,
                alpha: frame.renderConfig.alpha,
                inverted: frame.renderConfig.inverted,
                visibility: frame.renderConfig.visible,
                nanColorHex: preference.nanColorHex,
                nanAlpha: preference.nanAlpha
            };
        }
        const padding = this.props.overlaySettings.padding;
        let className = "raster-div";
        if (this.props.docked) {
            className += " docked";
        }
        return (
            <div className={className}>
                <canvas
                    className="raster-canvas"
                    id="raster-canvas"
                    ref={(ref) => this.canvas = ref}
                    style={{
                        top: padding.top,
                        left: padding.left,
                        width: frame && frame.isRenderable ? (frame.renderWidth || 1) : 1,
                        height: frame && frame.isRenderable ? (frame.renderHeight || 1) : 1
                    }}
                />
            </div>);
    }
}
