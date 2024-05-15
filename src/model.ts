import { Vector3 } from "@babylonjs/core/Maths/math.vector";

export interface ChartDataBoundInfo {
    min: Vector3;
    max: Vector3;
    d: Vector3;
}

export interface FontStyleInfo {
    fontName: string;
    size: number;
    resolution: number;
    depth: number;
}

export type ChartOptions = any
export type ChartData = any
