import { ChartData } from "../model";

export function isXYZ(data: ChartData) {
    return data.z?.values?.length > 0;
}

// const z = (data.options.box.depth / (data.y.values.length + 1)) * j
