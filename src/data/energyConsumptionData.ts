import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Scalar } from "@babylonjs/core/Maths/math.scalar";
import { ChartDataBoundInfo, ChartOptions } from "../model";
import { Vector3 } from "@babylonjs/core";

import data from "./energy-cinsumption.json";
import { arrayConcat } from "../utils/helpers";

export function getData() {
    const options: ChartOptions = {
        camera: {
            minZ: 0.1,
            maxZ: 200,
        },
        dimensions: {
            xCount: null,
            yCount: 10,
            zCount: null,
            x: 10,
            y: 10,
            z: 4,
        },
        fonts: [
            {
                name: "droid-regular",
                url: "https://assets.babylonjs.com/fonts/Droid Sans_Regular.json",
            },
            {
                name: "roboto-regular",
                url: "/fonts/Roboto/json/Roboto_Regular.json",
            },
        ],
        fontStyles: {
            default: {
                fontName: "roboto-regular",
                size: 1,
                resolution: 16,
                depth: 0.02,
            },
            "roboto-big": {
                fontName: "roboto-regular",
                size: 1,
                resolution: 16,
                depth: 0.02,
            },
            "droid-big": {
                fontName: "droid-regular",
                size: 1,
                resolution: 16,
                depth: 0.02,
            },
            "droid-small": {
                fontName: "droid-regular",
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
            offset: [0, 4, 0],
            billboardMode: true,
            // unlit: true,
            // fontStyleOverrides: { size: 2, resolution: 16, depth: 1 },
        },
        box: {
            draw: false,
            color: Color3.Gray(),
            thickness: 0.04,
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
                    thickness: 0.03,
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
                    draw: false,
                    showValue: true,
                    color: Color3.Gray(),
                    thickness: 0.03,
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
                    draw: false,
                    showValue: true,
                    color: Color3.Gray(),
                    thickness: 0.03,
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
            color: Color3.Black(),
            thickness: 0.1,
            glow: true,
            alpha: 1,
            group: 2,
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
            type: "point",
            name: "point-chart",
            draw: false,
            color: Color3.Magenta(),
            diameter: 0.4,
            segments: 8,
            glow: true,
            alpha: 1,
            group: 2,
        },
        {
            type: "plane",
            name: "plane-chart",
            draw: false,
            color: Color3.Gray(),
            colorMode: "multiply", // multiply, add, set
            smooth: true,
            glow: false,
            alpha: 0.5,
            group: 2,
            range: {
                use: false,
                x: [8, 14],
                z: [7, 13],
            },
        },
        {
            type: "plane-wireframe",
            name: "wireframeplane-chart",
            draw: false,
            color: Color3.White(),
            width: 0.1,
            colorMode: "multiply", // multiply, add, set
            glow: false,
            alpha: 1,
            group: 2,
        },
    ];

    const charts2 = [
        {
            type: "line",
            name: "line-chart",
            draw: true,
            color: Color3.Red(),
            thickness: 0.1,
            glow: true,
            alpha: 1,
            group: 2,
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
            type: "line-area",
            name: "line-area-chart2",
            draw: false,
            color: Color3.Green(),
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
            type: "box",
            name: "box-chart2",
            draw: false,
            color: Color3.White(),
            width: 0.04,
            depth: 0.04,
            glow: false,
            alpha: 1,
            group: 1,
        },
        {
            type: "point",
            name: "point-chart",
            draw: true,
            color: Color3.Red(),
            diameter: 0.2,
            segments: 8,
            glow: false,
            alpha: 1,
            group: 2,
        },
        {
            type: "point",
            name: "point-chart2",
            draw: true,
            color: Color3.Yellow(),
            diameter: 0.4,
            segments: 8,
            glow: false,
            alpha: 1,
            group: 1,
        },
        {
            type: "plane",
            name: "plane-chart",
            draw: false,
            color: Color3.Red(),
            colorMode: "multiply", // multiply, add, set
            smooth: false,
            glow: false,
            alpha: 1,
            group: 1,
            range: {
                use: false,
                x: [2, 14],
                z: [2, 13],
            },
        },
        {
            type: "plane-wireframe",
            name: "wireframeplane-chart",
            draw: false,
            color: Color3.Black(),
            width: 0.1,
            colorMode: "multiply", // multiply, add, set
            glow: false,
            alpha: 1,
            group: 1,
        },
    ];

    const chartsPie = [
        {
            type: "pie",
            name: "pie-chart",
            draw: true,
            color: ["indianred", "steelblue", "olive", "aliceblue", "#F5DEB3"],
            labels: ["babylon.js", "godot", "three.js", "unity", "unreal"],
            glow: true,
            alpha: 0.6,
            group: 1,
            radius: 10,
            segments: 32,
            showLabel: false,
            showValue: false,
            spaceBetweenSlices: true,
            innerRadiusPct: 40,
            labelFontFactor: 2,
            clickScalePct: 20,
            verticalFactor: 1,
        },
    ];

    const values3d = {
        x: {},
        y: {},
        z: {},
    };

    const elctricity = data.monthlyvalues.filter(
        (mv) => mv.key === "consumptionelectricity"
    );
    console.log(data);
    // const xDistinctValues = new Set();
    const xDistinctValues = [];
    const yDistinctValues = [];
    const xValues = [];
    const yValues = [];
    const zDistinctValues = new Set<number>();

    //     xValues.add(mv.month)
    // yValues.push(mv.value)

    for (const mv of elctricity) {
        zDistinctValues.add(mv.year);
    }

    for (const zValue of zDistinctValues) {
        const valesForZ = elctricity.filter(
            (mv) => mv.year === zValue
        );
        const xValuesForZ = valesForZ.map((mv) => mv.month);
        const yValuesForZ = valesForZ.map((mv) => mv.value);

        xDistinctValues.length = 0
        for (const v of xValuesForZ) {
            // xDistinctValues.add(xValue);
            xDistinctValues.push(v)
        }

        yDistinctValues.length = 0
        for (const v of yValuesForZ) {
            yDistinctValues.push(v);
        }
        // xValues.push(Array.from(xDistinctValues) as number[]);
        xValues.push(arrayConcat(xDistinctValues, []));
        yValues.push(arrayConcat(yDistinctValues, []));
    }

    values3d.x.values = xValues;
    values3d.y.values = yValues;
    values3d.z.values = Array.from(zDistinctValues) as number[];

    // default
    // return {
    //     options,
    //     charts: charts,
    //     x: valuesPie.x,
    //     y: valuesPie.y,
    // };

    // enhanced
    return {
        options,
        charts: charts2,
        x: values3d.x,
        y: values3d.y,
        z: values3d.z,
    };
}
