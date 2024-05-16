import { Mesh, Scene } from "@babylonjs/core";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { ChartData } from "../model";

let _glowLayer: GlowLayer;

export function _setupGlow(data: ChartData, scene: Scene) {
    if (!data.options.glow.enabled) {
        return;
    }
    const gl = new GlowLayer("glow", scene);
    gl.blurKernelSize = data.options.glow.blurKernelSize;
    gl.intensity = data.options.glow.intensity;
    _glowLayer = gl;
}

export function includeInGlow(mesh: Mesh) {
    _glowLayer && _glowLayer.referenceMeshToUseItsOwnMaterial(mesh);
}

export function excludeFromGlow(mesh: Mesh) {
    _glowLayer && _glowLayer.addExcludedMesh(mesh);
}
