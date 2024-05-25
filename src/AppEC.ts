import {
    Scene,
    Vector3,
    HemisphericLight,
    Engine,
    ArcRotateCamera,
    CreateGreasedLine,
    Color3,
} from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import { ChartData } from "./model";
import { getData } from "./data/energyConsumptionData";
import { getBoundInfo } from "./utils/bounds";
import { isXYZ, transformData, transformDataXYZ } from "./utils/helpers";
import { drawChartMainLabel, setupFonts } from "./text/text";
import { _setupGlow } from "./effects/glowEffect";
import { drawBox, zoomOnAxisBox } from "./axis/axisBox";
import { drawMarkersOnAxis } from "./axis/axis";
// import { drawValues } from "./visualizers/defaultVisualizer";
import { drawValues } from "./visualizers/enhancedVisualizer";

export class AppEC {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;

    private _scene: Scene;
    private _camera: ArcRotateCamera;

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

        // this._drawAxis();

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

    private _drawAxis(size = 10) {
        const x = CreateGreasedLine(
            "debug-x-axis",
            {
                points: [0, 0, 0, size, 0, 0],
            },
            {
                useColors: true,
                colors: [Color3.Red()],
                sizeAttenuation: true,
                width: 10
            }
        );

        const y = CreateGreasedLine(
            "debug-y-axis",
            {
                points: [0, 0, 0, 0, size, 0],
                instance: x,
            },
            {
                useColors: true,
                colors: [Color3.Green()],
                sizeAttenuation: true,
                width: 10,
            }
        );

        const z = CreateGreasedLine(
            "debug-z-axis",
            {
                points: [0, 0, 0, 0, 0, size],
                instance: x,
            },
            {
                useColors: true,
                colors: [Color3.Blue()],
                sizeAttenuation: true,
                width: 10,
            }
        );
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
        camera.maxZ = 20000;
        camera.minZ = 0.1;
        return camera;
    }

    public async start() {
        const light = new HemisphericLight(
            "light1",
            new Vector3(-1, 1, 0),
            this.scene
        );

        light.intensity = 0.6;

        const chartData = getData();
        const transformedValues = isXYZ(chartData) ? transformDataXYZ(chartData) : transformData(chartData)
        chartData.x = transformedValues.x
        chartData.y = transformedValues.y
        chartData.z = transformedValues.z
        await this.drawChart(chartData);
    }

    public async drawChart(data: ChartData) {
        console.log(data)
        const boundInfo = getBoundInfo(data) //, isXYZ(data) ? 0 : undefined);

        await setupFonts(data);

        _setupGlow(data, this.scene);

        const axisBox = drawBox(data, boundInfo);
        zoomOnAxisBox(axisBox, 1, this._camera);

        // this._drawValueMarkersOnAxis(data, boundInfo)
        drawMarkersOnAxis(data, boundInfo, this.scene);
        // drawChartMainLabel(data, boundInfo, this.scene);
        drawValues(data, boundInfo, this.scene);
    }
}
