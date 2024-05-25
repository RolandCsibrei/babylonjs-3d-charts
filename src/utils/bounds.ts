import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { ChartData, ChartDataBoundInfo } from "../model";

export function getBoundInfo(
    data: ChartData,
    index?: number
): ChartDataBoundInfo {
    if (data.options.boundInfo) {
        return data.options.boundInfo;
    }

    const maxDimensions = {
        x: 10,
        y: 10,
        z: 10,
    };

    const xValues = index !== undefined ? data.x.values[index] : data.x.values;
    const yValues = index !== undefined ? data.y.values[index] : data.y.values;
    const zValues = data.z?.values ?? [0];

    // draw axis
    const minX = Math.min(0, ...xValues);
    const maxX = Math.max(0, ...xValues);
    const minY = Math.min(0, ...yValues);
    const maxY = Math.max(0, ...yValues);
    const minZ = Math.min(0, ...zValues);
    const maxZ = Math.max(0, ...zValues);

    const dx = Math.abs(maxX) - Math.abs(minX);
    const dy = Math.abs(maxY) - Math.abs(minY);
    const dz = Math.abs(maxZ) - Math.abs(minZ);
    const d = new Vector3(dx, dy, dz);

    return {
        min: new Vector3(minX, minY, minZ),
        max: new Vector3(maxX, maxY, maxZ),
        d,
        multiplier: Vector3.Normalize(d).multiplyByFloats(dx, dy, dz),
    };
}

export function getDz(data: ChartData, boundInfo: ChartDataBoundInfo) {
    // TODO: box.depth removed
    const dz =
        data.options.box.depth === "auto"
            ? boundInfo.d.z + 2
            : data.options.box.depth;
    return dz;
}

export function getPositionsOnAxes(data: ChartData) {
    const dimensions = data.options.dimensions;

    const xPos = [];
    const stepX = Math.max(
        dimensions.x / data.x.values.length,
        dimensions.x / (dimensions.xCount ?? data.x.values.length)
    );
    for (let i = 0; i < (dimensions.xCount ?? data.x.values.length); i++) {
        xPos.push(i * stepX);
    }

    const yPos = [];

    const stepY = Math.max(
        dimensions.y / data.y.values.length,
        dimensions.y / (dimensions.yCount ?? data.y.values.length)
    );
    for (let i = 0; i < (dimensions.yCount ?? data.y.values.length); i++) {
        yPos.push(i * stepY);
    }

    const zPos = [];
    const stepZ = Math.max(
        dimensions.z / data.z.values.length,
        dimensions.z / (dimensions.zCount ?? data.z.values.length)
    );
    for (let i = 0; i < (dimensions.zCount ?? data.z.values.length); i++) {
        zPos.push(i * stepZ);
    }

    return {
        positions: {
            stepX,
            stepY,
            stepZ,
            x: xPos,
            y: yPos,
            z: zPos,
        },
    };
}
