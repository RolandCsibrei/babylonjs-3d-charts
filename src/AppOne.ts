import {
    Scene,
    Vector3,
    HemisphericLight,
    StandardMaterial,
    Color3,
    Texture,
    Engine,
    ArcRotateCamera,
    Scalar,
    CreateText,
    GlowLayer,
    CreateGreasedLine,
    GreasedLineMeshColorMode,
    GreasedLineRibbonPointsMode,
    GreasedLineMeshColorDistribution,
    GreasedLineMeshColorDistributionType,
    TransformNode,
    CreateSphere,
    CreateBox,
} from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import MyEarcut from "earcut";

import { ChartData, ChartDataBoundInfo, FontStyleInfo } from "./model";

export class AppOne {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;

    private _scene: Scene;
    private _camera: ArcRotateCamera;
    private _glowLayer?: GlowLayer;

    // private _chartDataBoundInfo: ChartDataBoundInfo
    private _fontData: Map<string, any> = new Map();

    public get scene() {
        return this._scene;
    }

    constructor(readonly canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._engine = new Engine(canvas);
        window.addEventListener("resize", () => {
            this._engine.resize();
        });
        this._scene = new Scene(this._engine);

        this._camera = this._setupCamera();

        this.start();
    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.scene.debugLayer.show({ overlay: true });
        } else {
            this.scene.debugLayer.hide();
        }
    }

    run() {
        this.debug(true);
        this._engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    private _setupCamera() {
        const camera = new ArcRotateCamera(
            "camera",
            5.28,
            1,
            20,
            new Vector3(0, 0, 0),
            this.scene
        );
        camera.setTarget(Vector3.Zero());
        camera.attachControl(this._canvas, true);
        camera.maxZ = 2000;
        camera.minZ = 0.1;
        return camera;
    }

    public async start() {
        const light = new HemisphericLight(
            "light1",
            new Vector3(1, 1, 0),
            this.scene
        );
        light.intensity = 0.7;

        await this.drawChart(this._getData());
    }

    public async drawChart(data: ChartData) {
        const boundInfo = this._getBoundInfo(
            data,
            this._isXYZ(data) ? 0 : undefined
        );
        await this._setupFonts(data);
        this._setupGlow(data);
        this._drawBox(data, boundInfo);
        // this._drawValueMarkersOnAxis(data, boundInfo)
        this._drawMarkersOnAxis(data, boundInfo);
        this._drawLabel(data, boundInfo);
        this._drawValues(data, boundInfo);
    }

    private async _setupFonts(data: ChartData) {
        const fonts = data.options.fonts;
        for (const font of fonts) {
            const url = font.url;
            const name = font.name;
            const fontData = await (await fetch(url)).json();
            this._fontData.set(name, fontData);
        }
    }

    private _getFont(fontStyle: string, data: ChartData) {
        const fontStyleData = data.options.fontStyles[
            fontStyle
        ] as FontStyleInfo;
        return {
            fontData: this._fontData.get(fontStyleData.fontName),
            fontStyle: fontStyleData,
        };
    }

    private _getBoundInfo(data: ChartData, index?: number): ChartDataBoundInfo {
        const xValues =
            index !== undefined ? data.x.values[index] : data.x.values;
        const yValues =
            index !== undefined ? data.y.values[index] : data.y.values;
        const zValues = data.z?.values ?? [0];

        // draw axis
        const minX = Math.min(0, ...xValues);
        const maxX = Math.max(0, ...xValues);
        const minY = Math.min(0, ...yValues);
        const maxY = Math.max(0, ...yValues);
        const minZ = Math.min(0, ...zValues);
        const maxZ = Math.max(0, ...zValues);

        const dx = maxX - minX;
        const dy = maxY - minY;
        const dz = maxZ - minZ;

        return {
            min: new Vector3(minX, minY, minZ),
            max: new Vector3(maxX, maxY, maxZ),
            d: new Vector3(dx, dy, dz),
        };
    }

    private _setupGlow(data: ChartData) {
        if (!data.options.glow.enabled) {
            return;
        }
        const gl = new GlowLayer("glow", this.scene);
        gl.blurKernelSize = data.options.glow.blurKernelSize;
        gl.intensity = data.options.glow.intensity;
        this._glowLayer = gl;
    }

    private _drawLabel(data: ChartData, boundInfo: ChartDataBoundInfo) {
        if (data.options.label?.draw) {
            const fontInfo = this._getFont(data.options.label.fontStyle, data);
            const titleLabel = CreateText(
                "chart-label",
                data.options.label.text,
                fontInfo.fontData,
                {
                    size: fontInfo.fontStyle.size,
                    resolution: fontInfo.fontStyle.resolution,
                    depth: fontInfo.fontStyle.depth,
                },
                this.scene,
                MyEarcut
            );

            if (titleLabel) {
                const material = new StandardMaterial(
                    "label-material",
                    this.scene
                );
                material.emissiveColor = data.options.label.color;

                titleLabel.material = material;

                const dx = boundInfo.d.x;
                const dy = boundInfo.d.y;
                const dz = this._getDz(data, boundInfo);

                titleLabel.position.x = dx / 2;
                titleLabel.position.y = dy + 0.1;
                titleLabel.position.z = dz;

                this._glowLayer && this._glowLayer.addExcludedMesh(titleLabel);
            }
        }
    }

    private _drawBox(data: ChartData, boundInfo: ChartDataBoundInfo) {
        if (!data.options.box.draw) {
            return;
        }

        const dx = boundInfo.d.x;
        const dy = boundInfo.d.y;
        const dz = this._getDz(data, boundInfo);

        // draw box
        const boxPoints = [
            [0, 0, 0, dx, 0, 0],
            [0, 0, 0, 0, dy, 0],
            [0, 0, 0, 0, 0, dz],
            [0, 0, dz, 0, dy, dz],
            [0, dy, 0, 0, dy, dz],
            [0, dy, dz, dx, dy, dz],
            [dx, dy, dz, dx, 0, dz],
            [dx, 0, dz, dx, 0, 0],
            [0, 0, dz, dx, 0, dz],
        ];
        const axisBox = CreateGreasedLine(
            "axisBox",
            {
                points: boxPoints,
            },
            {
                width: data.options.box.thickness,
                color: data.options.box.color,
            }
        );

        this._camera.zoomOn([axisBox]);
    }

    private _drawValues(data: ChartData, boundInfo: ChartDataBoundInfo) {
        if (this._isXYZ(data)) {
            for (let i = 0; i < data.z.values.length; i++) {
                const xValues = data.x.values[i];
                const yValues = data.y.values[i];
                const dx = boundInfo.d.x;
                const dy = boundInfo.d.y;
                const dz = data.z.values[i]; // (data.options.box.depth / (data.y.values.length + 1)) * i
                this._drawValuesWithChart(
                    data,
                    xValues,
                    yValues,
                    boundInfo,
                    dz
                );
            }
        } else {
            const xValues = data.x.values;
            const yValues = data.y.values;

            const dx = boundInfo.d.x;
            const dy = boundInfo.d.y;
            const dz = this._getDz(data, boundInfo);
            this._drawValuesWithChart(data, xValues, yValues, boundInfo, dz);
        }
    }

    private _drawValuesWithChart(
        data: ChartData,
        xValues: number[],
        yValues: number[],
        boundInfo: ChartDataBoundInfo,
        dz: number
    ) {
        const charts = data.charts;
        for (const chart of charts) {
            if (chart.draw) {
                switch (chart.type) {
                    case "line":
                        this._drawLineChart(
                            data,
                            xValues,
                            yValues,
                            boundInfo,
                            chart,
                            dz
                        );
                        break;
                    case "box":
                        this._drawBoxChart(
                            data,
                            xValues,
                            yValues,
                            boundInfo,
                            chart,
                            dz
                        );
                        break;
                    case "sphere":
                        this._drawSphereChart(
                            data,
                            xValues,
                            yValues,
                            boundInfo,
                            chart,
                            dz
                        );
                        break;
                    case "line-area":
                        this._drawLineWithAreaChart(
                            data,
                            xValues,
                            yValues,
                            boundInfo,
                            chart,
                            dz
                        );
                        break;
                    case "plane":
                        this._drawPlaneChart(
                            data,
                            xValues,
                            yValues,
                            boundInfo,
                            chart,
                            dz
                        );
                        chart.drawn = true;
                        break;
                }
            }
        }
    }

    private _isXYZ(data: ChartData) {
        return data.z?.values?.length > 0;
    }

    private _drawPlaneChart(
        data: ChartData,
        xValues: number[],
        yValues: number[],
        boundInfo: ChartDataBoundInfo,
        chart: ChartData,
        dz: number
    ) {
        if (!chart.draw || chart.drawn) {
            return;
        }

        // draw values
        const paths = [];
        for (let i = 0; i < data.z.values.length; i++) {
            const linePoints = [];
            // const dz = (data.options.box.depth / (data.y.values.length + 1)) * i

            for (let j = 0; j < data.x.values[i].length; j++) {
                linePoints.push(
                    data.x.values[i][j],
                    data.y.values[i][j],
                    data.z.values[i]
                );
            }
            paths.push(linePoints);
        }

        const colorMode =
            chart.colorMode === "multiply"
                ? GreasedLineMeshColorMode.COLOR_MODE_MULTIPLY
                : chart.colorMode === "add"
                ? GreasedLineMeshColorMode.COLOR_MODE_ADD
                : GreasedLineMeshColorMode.COLOR_MODE_SET;
        const line = CreateGreasedLine(
            chart.name,
            {
                points: paths,
                ribbonOptions: {
                    pointsMode: GreasedLineRibbonPointsMode.POINTS_MODE_PATHS,
                    smoothShading: chart.smooth,
                },
            },
            {
                color: chart.color,
                useColors: true,
                colors: [Color3.Green(), Color3.Yellow(), Color3.Green()],
                colorDistribution:
                    GreasedLineMeshColorDistribution.COLOR_DISTRIBUTION_REPEAT,
                colorDistributionType:
                    GreasedLineMeshColorDistributionType.COLOR_DISTRIBUTION_TYPE_LINE,
                colorsSampling: Texture.LINEAR_LINEAR,
                colorMode,
            }
        );

        const parent = new TransformNode(chart.name, this.scene);
        line.parent = parent;

        line.renderingGroupId = chart.group;
        line.material && (line.material.alpha = chart.alpha);

        if (chart.wireframe?.draw) {
            const i = 1;
            for (let i = 0; i < data.y.values[0].length; i++) {
                const linePoints = [];
                for (let j = 0; j < data.z.values.length; j++) {
                    const x = data.x.values[j][i];
                    const y = data.y.values[j][i];
                    // const z = (data.options.box.depth / (data.y.values.length + 1)) * j

                    linePoints.push(x, y, data.z.values[j]);
                }
                paths.push(linePoints);
            }

            const lineWireframe = CreateGreasedLine(
                chart.name + "-wireframe",
                {
                    points: paths,
                    // ribbonOptions: {}
                },
                {
                    color: chart.wireframe.color,
                    colorMode: GreasedLineMeshColorMode.COLOR_MODE_SET,

                    // useDash: true,
                    // dashCount: 30,
                    // dashRatio: 0.2,
                }
            );
            lineWireframe.renderingGroupId = chart.group;

            lineWireframe.position.y += 0.05;
        }

        if (this._glowLayer && chart.glow) {
            this._glowLayer.referenceMeshToUseItsOwnMaterial(line);
        }
    }

    private _drawLineChart(
        data: ChartData,
        xValues: number[],
        yValues: number[],
        boundInfo: ChartDataBoundInfo,
        chart: ChartData,
        dz: number
    ) {
        // draw values
        const linePoints = [];
        for (let i = 0; i < xValues.length - 2; i++) {
            linePoints.push([
                xValues[i],
                yValues[i],
                dz,
                xValues[i + 1],
                yValues[i + 1],
                dz,
            ]);
        }

        const line = CreateGreasedLine(
            chart.name,
            {
                points: linePoints,
            },
            {
                color: chart.color,
                width: chart.thickness,
            }
        );

        const parent = new TransformNode(chart.name, this.scene);
        line.parent = parent;

        line.renderingGroupId = chart.group;
        line.material && (line.material.alpha = chart.alpha);

        if (this._glowLayer && chart.glow) {
            this._glowLayer.referenceMeshToUseItsOwnMaterial(line);
        }
    }

    private _drawLineWithAreaChart(
        data: ChartData,
        xValues: number[],
        yValues: number[],
        boundInfo: ChartDataBoundInfo,
        chart: ChartData,
        dz: number
    ) {
        if (!chart.draw) {
            return;
        }

        // draw values
        const linePoints = [];
        const linePointsLower = [];
        for (let i = 0; i < xValues.length - 1; i++) {
            linePoints.push(xValues[i], yValues[i], dz);
            linePointsLower.push(xValues[i], 0, dz);
        }

        const line = CreateGreasedLine(
            chart.name,
            {
                points: [linePoints, linePointsLower],
                ribbonOptions: {
                    pointsMode: GreasedLineRibbonPointsMode.POINTS_MODE_PATHS,
                },
            },
            {
                color: chart.color,
                width: chart.thickness,
            }
        );

        const parent = new TransformNode(chart.name, this.scene);
        line.parent = parent;

        line.renderingGroupId = chart.group;
        line.material && (line.material.alpha = chart.alpha);

        if (this._glowLayer && chart.glow) {
            this._glowLayer.referenceMeshToUseItsOwnMaterial(line);
        }
    }

    private _drawBoxChart(
        data: ChartData,
        xValues: number[],
        yValues: number[],
        boundInfo: ChartDataBoundInfo,
        chart: ChartData,
        dz: number
    ) {
        if (!chart.draw) {
            return;
        }

        const parent = new TransformNode(chart.name, this.scene);
        for (let i = 0; i < xValues.length - 1; i++) {
            const boxMaterial = new StandardMaterial(
                "box-material",
                this.scene
            );
            boxMaterial.emissiveColor = chart.color;

            const box = CreateBox(chart.name, {
                width: chart.width,
                depth: chart.depth,
                height: yValues[i],
            });
            box.position.x = xValues[i];
            box.position.y = yValues[i] / 2;
            box.position.z = dz - chart.depth;

            box.material = boxMaterial;
            box.parent = parent;

            box.renderingGroupId = chart.group;
            box.material.alpha = chart.alpha;

            if (this._glowLayer && chart.glow) {
                this._glowLayer.referenceMeshToUseItsOwnMaterial(box);
            }
        }
    }

    private _drawSphereChart(
        data: ChartData,
        xValues: number[],
        yValues: number[],
        boundInfo: ChartDataBoundInfo,
        chart: ChartData,
        dz: number
    ) {
        if (!chart.draw) {
            return;
        }
        const parent = new TransformNode(chart.name, this.scene);

        for (let i = 0; i < xValues.length - 1; i++) {
            const sphereMaterial = new StandardMaterial(
                "sphere-material",
                this.scene
            );
            sphereMaterial.emissiveColor = chart.color;

            const sphere = CreateSphere(chart.name, {
                diameter: chart.diameter,
                segments: chart.segments,
            });
            sphere.position.x = xValues[i];
            sphere.position.y = yValues[i];
            sphere.position.z = dz;

            sphere.material = sphereMaterial;
            sphere.parent = parent;

            sphere.renderingGroupId = chart.group;
            sphere.material.alpha = chart.alpha;

            if (this._glowLayer && chart.glow) {
                this._glowLayer.referenceMeshToUseItsOwnMaterial(sphere);
            }
        }
    }

    private _drawValueMarkersOnAxis(
        data: ChartData,
        boundInfo: ChartDataBoundInfo
    ) {
        const xValues = data.x.values;
        const dz = this._getDz(data, boundInfo);

        const fontInfo = this._getFont(
            data.options.axis.x.labels.fontStyle,
            data
        );

        const labelMaterial = new StandardMaterial(
            "label-material",
            this.scene
        );
        labelMaterial.emissiveColor = Color3.White();

        // draw Axis Markers
        for (const v of xValues) {
            if (data.options.axis.x.rulers.draw) {
                CreateGreasedLine(
                    "xv",
                    {
                        points: [v, 0, 0, v, 0, dz],
                    },
                    {
                        width: data.options.axis.x.rulers.thickness,
                        useDash: true,
                        dashCount: dz * 2,
                        dashRatio: 0.2,
                        color: data.options.axis.x.rulers.color,
                    }
                );
            }

            if (data.options.axis.x.labels.draw) {
                const size = 0.3;
                const xLabel = CreateText(
                    "x-label",
                    `${v}`,
                    fontInfo.fontData,
                    fontInfo.fontStyle,
                    this.scene,
                    MyEarcut
                );

                if (xLabel) {
                    xLabel.material = labelMaterial;
                    xLabel.position.x = v;
                    xLabel.position.y -= size / 2;
                    xLabel.position.z -= 0.2;
                    this._glowLayer && this._glowLayer.addExcludedMesh(xLabel);
                }
            }
        }

        const yValues = data.y.values;
        for (const v of yValues) {
            if (data.options.axis.y.rulers.draw) {
                CreateGreasedLine(
                    "xv",
                    {
                        points: [0, v, 0, 0, v, dz],
                    },
                    {
                        width: data.options.axis.y.rulers.thickness,
                        useDash: true,
                        dashCount: dz * 2,
                        dashRatio: 0.2,
                        color: data.options.axis.y.rulers.color,
                    }
                );
            }

            if (data.options.axis.y.labels.draw) {
                const size = 0.3;
                const yLabel = CreateText(
                    "y-label",
                    `${v}`,
                    fontInfo.fontData,
                    fontInfo.fontStyle,
                    this.scene,
                    MyEarcut
                );

                if (yLabel) {
                    yLabel.material = labelMaterial;
                    yLabel.position.x -= size / 2;
                    yLabel.position.y = v;
                    yLabel.position.z -= 0.2;

                    this._glowLayer && this._glowLayer.addExcludedMesh(yLabel);
                }
            }
        }
    }

    private _drawMarkersOnAxis(data: ChartData, boundInfo: ChartDataBoundInfo) {
        const minX = boundInfo.min.x;
        const maxX = boundInfo.max.x;
        const minY = boundInfo.min.y;
        const maxY = boundInfo.max.y;

        const dz = this._getDz(data, boundInfo);

        const fontInfo = this._getFont(
            data.options.axis.x.labels.fontStyle,
            data
        );

        const labelMaterial = new StandardMaterial(
            "label-material",
            this.scene
        );
        labelMaterial.emissiveColor = Color3.White();

        // draw Axis Markers
        const stepX = 1;
        for (let x = minX; x <= maxX; x += stepX) {
            if (data.options.axis.x.rulers.draw) {
                CreateGreasedLine(
                    "xv",
                    {
                        points: [x, 0, 0, x, 0, dz],
                    },
                    {
                        width: data.options.axis.y.rulers.thickness,
                        useDash: true,
                        dashCount: dz * 2,
                        dashRatio: 0.2,
                        color: data.options.axis.x.rulers.color,
                    }
                );
            }

            if (data.options.axis.x.labels.draw) {
                const size = 0.3;
                const xLabel = CreateText(
                    "x-label",
                    `${x}`,
                    fontInfo.fontData,
                    fontInfo.fontStyle,
                    this.scene,
                    MyEarcut
                );

                if (xLabel) {
                    xLabel.material = labelMaterial;
                    xLabel.position.x = x;
                    xLabel.position.y -= size / 2;
                    xLabel.position.z -= 0.5;
                    xLabel.renderingGroupId = 3;

                    this._glowLayer && this._glowLayer.addExcludedMesh(xLabel);
                }
            }
        }

        const stepY = 1;
        for (let y = minY; y <= maxY; y += stepY) {
            if (data.options.axis.y.rulers.draw) {
                CreateGreasedLine(
                    "yv",
                    {
                        points: [0, y, 0, 0, y, dz],
                    },
                    {
                        width: data.options.axis.y.rulers.thickness,
                        useDash: true,
                        dashCount: dz * 2,
                        dashRatio: 0.2,
                        color: data.options.axis.y.rulers.color,
                    }
                );
            }

            if (data.options.axis.y.labels.draw) {
                const size = 0.3;
                const label = Math.round(y * 1000) / 1000;
                const yLabel = CreateText(
                    "y-label",
                    `${label}`,
                    fontInfo.fontData,
                    fontInfo.fontStyle,
                    this.scene,
                    MyEarcut
                );
                if (yLabel) {
                    yLabel.material = labelMaterial;
                    yLabel.position.x -= size / 2;
                    yLabel.position.y = y;
                    yLabel.position.z -= 0.5;
                    yLabel.renderingGroupId = 3;

                    this._glowLayer && this._glowLayer.addExcludedMesh(yLabel);
                }
            }
        }

        // draw Z axis if needed
        if (this._isXYZ(data)) {
            const minZ = boundInfo.min.z;
            const maxZ = boundInfo.max.z;
            const stepZ = 1;
            for (let z = 0; z <= maxZ; z += stepZ) {
                if (data.options.axis.z.rulers.draw) {
                    CreateGreasedLine(
                        "zv",
                        {
                            points: [minX, 0, z, maxX, 0, z],
                        },
                        {
                            width: data.options.axis.z.rulers.thickness,
                            useDash: true,
                            dashCount: dz * 2,
                            dashRatio: 0.2,
                            color: data.options.axis.z.rulers.color,
                        }
                    );
                }

                if (data.options.axis.z.labels.draw) {
                    const size = 0.3;
                    const label = Math.round(z * 1000) / 1000;
                    const zLabel = CreateText(
                        "z-label",
                        `${label}`,
                        fontInfo.fontData,
                        fontInfo.fontStyle,
                        this.scene,
                        MyEarcut
                    );
                    if (zLabel) {
                        zLabel.material = labelMaterial;
                        zLabel.position.x = maxX;
                        zLabel.position.y = 0;
                        zLabel.position.z = z;
                        zLabel.renderingGroupId = 3;

                        this._glowLayer &&
                            this._glowLayer.addExcludedMesh(zLabel);
                    }
                }
            }
        }
    }

    private _getDz(data: ChartData, boundInfo: ChartDataBoundInfo) {
        const dz =
            data.options.box.depth === "auto"
                ? boundInfo.d.z + 2
                : data.options.box.depth;
        return dz;
    }

    private _getData() {
        const options = {
            fonts: [
                {
                    name: "droid",
                    url: "https://assets.babylonjs.com/fonts/Droid Sans_Regular.json",
                },
            ],
            fontStyles: {
                "droid-big": {
                    fontName: "droid",
                    size: 1,
                    resolution: 16,
                    depth: 0.02,
                },
                "droid-small": {
                    fontName: "droid",
                    size: 0.3,
                    resolution: 16,
                    depth: 0.02,
                },
            },
            label: {
                draw: false,
                text: "3D charts",
                fontStyle: "droid-big",
                color: Color3.Yellow(),
            },
            box: {
                draw: true,
                color: Color3.Gray(),
                thickness: 0.01,
                depth: "auto", // auto or value
            },
            glow: {
                enabled: true,
                blurKernelSize: 16,
                intensity: 0.5,
            },
            axis: {
                x: {
                    labels: {
                        draw: true,
                        fontStyle: "droid-small",
                    },
                    rulers: {
                        draw: true,
                        showValue: true,
                        color: Color3.Gray(),
                        thickness: 0.01,
                        dashed: true,
                        dashCount: 10,
                        dashRatio: 0.4,
                    },
                },
                y: {
                    labels: {
                        draw: true,
                        fontStyle: "droid-small",
                    },
                    rulers: {
                        draw: true,
                        showValue: true,
                        color: Color3.Gray(),
                        thickness: 0.01,
                        dashed: true,
                        dashCount: 10,
                        dashRatio: 0.4,
                    },
                },
                z: {
                    labels: {
                        draw: true,
                        fontStyle: "droid-small",
                    },
                    rulers: {
                        draw: true,
                        showValue: true,
                        color: Color3.Gray(),
                        thickness: 0.01,
                        dashed: true,
                        dashCount: 10,
                        dashRatio: 0.4,
                    },
                },
            },
        };

        const charts = [
            {
                type: "line",
                name: "line-chart",
                draw: false,
                color: Color3.Red(),
                thickness: 0.1,
                glow: true,
                alpha: 1,
                group: 1,
            },
            {
                type: "line-area",
                name: "line-area-chart",
                draw: false,
                color: Color3.Magenta(),
                thickness: 0.1,
                glow: true,
                alpha: 0.2,
                group: 1,
            },
            {
                type: "box",
                name: "box-chart",
                draw: false,
                color: Color3.Blue(),
                width: 0.6,
                depth: 0.6,
                glow: true,
                alpha: 1,
                group: 0,
            },
            {
                type: "sphere",
                name: "sphere-chart",
                draw: true,
                color: Color3.Green(),
                diameter: 0.2,
                segments: 8,
                glow: true,
                alpha: 1,
                group: 2,
            },
            {
                type: "plane",
                name: "plane-chart",
                draw: true,
                color: Color3.Yellow(),
                wireframe: {
                    draw: true,
                    color: Color3.Black(),
                    width: 0.1,
                },
                colorMode: "multiply", // multiply, add, set
                smooth: false,
                glow: false,
                alpha: 1,
                group: 2,
            },
        ];

        const values = {
            x: {
                values: [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21, 22,
                    23, 28,
                ],
            },
            y: {
                values: [
                    7, 8, 8.4, 8.8, 6, 3, 2, 0.5, 5, 6, 6.2, 7, 7.3, 9, 10, 8,
                    6, 6, 5.5, 4, 7, 8, 9,
                ],
            },
        };

        const values3d = {
            x: {
                values: [
                    [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21,
                        22, 23, 28,
                    ],
                    [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21,
                        22, 23, 28,
                    ],
                    [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21,
                        22, 23, 28,
                    ],
                    [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21,
                        22, 23, 28,
                    ],
                    [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21,
                        22, 23, 28,
                    ],
                ],
            },
            y: {
                values: [
                    [
                        7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10,
                        8, 6, 6, 5.5, 4, 7, 8, 9,
                    ],
                    [
                        7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10,
                        8, 6, 6, 5.5, 4, 7, 8, 9,
                    ],
                    [
                        7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10,
                        8, 6, 6, 5.5, 4, 7, 8, 9,
                    ],
                    [
                        7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10,
                        8, 6, 6, 5.5, 4, 7, 8, 9,
                    ],
                    [
                        7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10,
                        8, 6, 6, 5.5, 4, 7, 8, 9,
                    ],
                ],
            },
            z: {
                values: [0, 4, 8, 12, 16],
            },
        };

        // randomize data
        for (let i = 0; i < values3d.y.values.length; i++) {
            for (let j = 0; j < values3d.y.values[i].length; j++) {
                values3d.y.values[i][j] += Scalar.RandomRange(-2, 4);
            }
        }

        return {
            options,
            charts,
            // x: values.x,
            // y: values.y,
            x: values3d.x,
            y: values3d.y,
            z: values3d.z,
        };
    }
}
