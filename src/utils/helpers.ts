import {
    ChartData,
    Chart,
    FontStyleInfo,
    Font,
    ZValues,
    XValues,
    YValues,
} from "../model";

import cssColors from "../css-color-names.json";

import { AbstractMesh, Color3, Mesh, Vector3 } from "@babylonjs/core";

export function isXYZ(data: ChartData) {
    return data.z?.values?.length > 0;
}

export function isInRange(
    chart: Chart,
    x: number | null,
    y: number | null,
    z: number | null
) {
    if (x !== null) {
        if (x < chart.range.x[0] || x > chart.range.x[1]) {
            return false;
        }
    }

    if (y !== null) {
        if (y < chart.range.y[0] || y > chart.range.y[1]) {
            return false;
        }
    }

    if (z !== null) {
        if (z < chart.range.z[0] || z > chart.range.z[1]) {
            return false;
        }
    }

    return true;
}

export function arrayConcat(source: Array<any>, destination: Array<any>) {
    for (let i = 0; i < source.length; i++) {
        destination.push(source[i]);
    }
    return destination;
}

export function convertColor(color: string) {
    const hexColor = color.startsWith("#") ? color : cssColors[color];
    return Color3.FromHexString(hexColor);
}

export function getColors(colors: string | string[], length: number) {
    const colorTable = [];
    if (typeof colors === "string") {
        const convertedColor = convertColor(colors);
        for (let i = 0; i < length; i++) {
            colorTable.push(convertedColor);
        }
        return colorTable;
    } else {
        for (let i = 0; i < length; i++) {
            const convertedColor =
                colors[i] === undefined
                    ? convertColor(colors[colors.length - 1])
                    : convertColor(colors[i]);
            colorTable.push(convertedColor);
        }
        return colorTable;
    }
}

export function getDirection(position: AbstractMesh) {
    const center = position.getBoundingInfo().boundingBox.center;
    return center.subtract(position.position).normalize();
}

export function transformData(data: ChartData) {
    // TODO sort & support null for counts
    const xCount = 5;
    const yCount = 10;
    const zCount = 3;

    const avg = false;

    let len = data.x.values.length;
    let step = Math.round(len / xCount);
    const xValues = [];
    for (let i = 0; i < len; i += step) {
        const value = getAvgValue(data.x.values, i, step, avg);
        xValues.push(value);
    }

    len = data.y.values.length;
    step = Math.round(len / yCount);
    const yValues = [];
    for (let i = 0; i < len; i += step) {
        const value = getAvgValue(data.y.values, i, step, avg);
        yValues.push(value);
    }

    len = data.z.values.length;
    step = Math.round(len / zCount);
    const zValues = [];
    for (let i = 0; i < len; i += step) {
        const value = getAvgValue(data.z.values, i, step, avg);
        zValues.push(value);
    }

    return {
        x: {
            values: xValues,
        },
        y: {
            values: yValues,
        },
        z: {
            values: zValues,
        },
    };
}
export function transformDataXYZ(data: ChartData) {
    const xCount = null;
    const yCount = null;
    const zCount = null;

    const avg = false;

    const len = data.z.values.length;
    const stepZ = Math.ceil(len / (zCount ?? len));

    const xValuesAll = [];
    const yValuesAll = [];

    const zValues = [];
    for (let iz = 0; iz < len; iz += stepZ) {
        const value = getAvgValue(data.z.values, iz, stepZ, avg);
        zValues.push(value);

        const lenX = data.x.values[iz].length;
        const stepX = Math.ceil(lenX / (xCount ?? lenX));
        const xValues = [];
        for (let ix = 0; ix < lenX; ix += stepX) {
            const value = getAvgValue(data.x.values[iz], ix, stepX, avg);
            xValues.push(value);
        }
        xValuesAll.push(xValues);

        const lenY = data.y.values[iz].length;
        const stepY = Math.ceil(lenY / (yCount ?? lenY));
        const yValues = [];
        for (let iy = 0; iy < lenY; iy += stepY) {
            const value = getAvgValue(data.y.values[iz], iy, stepY, avg);
            yValues.push(value);
        }
        yValuesAll.push(yValues);
    }

    return {
        x: {
            values: xValuesAll,
        },
        y: {
            values: yValuesAll,
        },
        z: {
            values: zValues,
        },
    };
}

function sortXY(xValues: XValues[], yValues: YValues[]) {

}

export function getAvgValue(
    values: number[],
    index: number,
    step: number,
    avg = false
) {
    if (!avg || step < 2) {
        return values[index];
    } else {
        let sum = values[index];
        for (let i = index + 1; i < index + step; i++) {
            sum += values[i];
        }
        return sum;
    }
}

export function getMinMax(values: XValues[] | YValues[]) {
    const mins = []
    const maxes = []

    for (const vals of values) {
        const min = Math.min(...vals)
        const max = Math.max(...vals)

        mins.push(min)
        maxes.push(max)
    }

    const min = Math.min(...mins)
    const max = Math.max(...maxes)

    return {
        min,
        max
    }
}

export function getPositionNormalizers(
    data: ChartData,
    xValues: number[],
    yValues: number[],
    zValues: ZValues
) {
    const dimensions = data.options.dimensions;
    const maxX = Math.max(...xValues);
    const maxY = Math.max(...yValues);
    zValues = zValues ?? [];
    const maxZ = zValues.length === 0 ? dimensions.z : zValues.length;

    return {
        x: dimensions.x / maxX,
        y: dimensions.y / maxY,
        z: dimensions.z / maxZ,
        max: {
            x: maxX,
            y: maxY,
            z: maxZ
        }
    };
}

export function clamp(input: number, min: number, max: number): number {
    return input < min ? min : input > max ? max : input;
}

export function map(
    current: number,
    in_min: number,
    in_max: number,
    out_min: number,
    out_max: number
): number {
    const mapped: number =
        ((current - in_min) * (out_max - out_min)) / (in_max - in_min) +
        out_min;
    return clamp(mapped, out_min, out_max);
}

export function getLongestValuesLengths(data: ChartData) {
    if (isXYZ(data)) {
        const xLengths = data.x.values.map((values: XValues) => values.length);
        const yLengths = data.y.values.map((values: YValues) => values.length);

        const maxX = Math.max(...xLengths);
        const maxY = Math.max(...yLengths);

        return {
            x: data.x.values[xLengths.indexOf(maxX)],
            y: data.y.values[yLengths.indexOf(maxY)],
            z: data.z.values,
        };
    } else {
        // TODO

        return {
            x: 1,
            y: 1,
            z: 0,
        };
    }
}
