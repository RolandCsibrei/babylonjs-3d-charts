import { Vector3 } from "@babylonjs/core/Maths/math.vector";

export interface ChartDataBoundInfo {
    min: Vector3;
    max: Vector3;
    d: Vector3;
    multiplier: Vector3;
}

export interface Font {
    fontData: any,
    fontStyle: FontStyleInfo
}
export interface FontStyleInfo {
    fontName: string;
    size: number;
    resolution: number;
    depth: number;
}
export interface FontStyleOverride {
    size?: number;
    resolution?: number;
    depth?: number;
}

export type ChartOptions = any
export type ChartData = any
export type Chart = any

export type XValues = number[]
export type YValues = number[]
export type ZValues = number[] | string[] | undefined | null