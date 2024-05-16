import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { ChartData, ChartDataBoundInfo } from "../model";

    export function getBoundInfo(data: ChartData, index?: number): ChartDataBoundInfo {
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


    export function getDz(data: ChartData, boundInfo: ChartDataBoundInfo) {
        const dz =
            data.options.box.depth === "auto"
                ? boundInfo.d.z + 2
                : data.options.box.depth;
        return dz;
    }