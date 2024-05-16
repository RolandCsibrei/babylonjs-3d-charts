import {
    Scene,
    Vector3,
    HemisphericLight,
    Engine,
    ArcRotateCamera,
} from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import { ChartData } from "./model";
import { getData } from "./data/demoData";
import { getBoundInfo } from "./utils/bounds";
import { isXYZ } from "./utils/helpers";
import { drawLabel, setupFonts } from "./text/text";
import { _setupGlow } from "./effects/glowEffect";
import { _drawBox, zoomOnAxisBox } from "./axis/axisBox";
import { _drawMarkersOnAxis } from "./axis/axis";
import { drawValues } from "./visualizers/defaultVisualizer";

export class AppOne {
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
            new Vector3(-1, 1, 0),
            this.scene
        );

        light.intensity = 0.6;

        await this.drawChart(getData());
    }

    public async drawChart(data: ChartData) {
        const boundInfo = getBoundInfo(data, isXYZ(data) ? 0 : undefined);

        await setupFonts(data);

        _setupGlow(data, this.scene);

        const axisBox = _drawBox(data, boundInfo);
        zoomOnAxisBox(axisBox, this._camera);

        // this._drawValueMarkersOnAxis(data, boundInfo)
        _drawMarkersOnAxis(data, boundInfo, this.scene);
        drawLabel(data, boundInfo, this.scene);
        drawValues(data, boundInfo, this.scene);
    }
}
