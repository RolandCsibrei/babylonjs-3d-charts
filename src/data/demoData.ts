import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Scalar } from "@babylonjs/core/Maths/math.scalar";
import { ChartDataBoundInfo, ChartOptions } from "../model";
import { Vector3 } from "@babylonjs/core";

export function getData() {
    const options: ChartOptions = {
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
            draw: true,
            color: Color3.Gray(),
            thickness: 0.04,
            // width: 10,
            // height: 10,
            depth: "auto", // auto or value
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
                    draw: true,
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
                    draw: true,
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
            draw: true,
            color: Color3.Black(),
            thickness: 0.1,
            glow: true,
            alpha: 1,
            group: 2,
        },
        {
            type: "line-area",
            name: "line-area-chart",
            draw: true,
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
            draw: false,
            color: Color3.Red(),
            thickness: 0.1,
            glow: true,
            alpha: 1,
            group: 2,
        },
        {
            type: "line-area",
            name: "line-area-chart",
            draw: true,
            color: Color3.Magenta(),
            thickness: 0.1,
            glow: true,
            alpha: 0.2,
            group: 1,
        },
        {
            type: "line-area",
            name: "line-area-chart2",
            draw: true,
            color: Color3.Green(),
            thickness: 0.1,
            glow: true,
            alpha: 0.2,
            group: 1,
        },
        {
            type: "box",
            name: "box-chart",
            draw: true,
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
            draw: true,
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
            draw: true,
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
            draw: true,
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

    const values = {
        x: {
            values: [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21, 22, 23,
                28,
            ],
        },
        y: {
            values: [
                7, 8, 8.4, 8.8, 6, 3, 2, 0.5, 5, 6, 6.2, 7, 7.3, 9, 10, 8, 6, 6,
                5.5, 4, 7, 8, 9,
            ],
        },
    };

    const values3d = {
        x: {
            values: [
                [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21, 22,
                    23, 28,
                ],
                [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21, 22,
                    23, 28,
                ],
                [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21, 22,
                    23, 28,
                ],
                [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21, 22,
                    23, 28,
                ],
                [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21, 22,
                    23, 28,
                ],
            ],
        },
        y: {
            values: [
                [
                    7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10, 8,
                    6, 6, 5.5, 4, 7, 8, 9,
                ],
                [
                    7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10, 8,
                    6, 6, 5.5, 4, 7, 8, 9,
                ],
                [
                    7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10, 8,
                    6, 6, 5.5, 4, 7, 8, 9,
                ],
                [
                    7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10, 8,
                    6, 6, 5.5, 4, 7, 8, 9,
                ],
                [
                    7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10, 8,
                    6, 6, 5.5, 4, 7, 8, 9,
                ],
            ],
        },
        z: {
            values: [0, 4, 8, 12, 16],
        },
    };
    const valuesPie = {
        x: {
            values: [20, 10, 30, 20, 20],
        },
        y: {
            values: [1, 1, 1, 1, 1],
        },
    };

    // randomize data
    for (let i = 0; i < values3d.y.values.length; i++) {
        for (let j = 0; j < values3d.y.values[i].length; j++) {
            values3d.y.values[i][j] += Scalar.RandomRange(-2, 4);
        }
    }

    // pie
    const min = Vector3.Zero();
    const max = new Vector3(10, 10, 2);
    const boundInfo: ChartDataBoundInfo = {
        min,
        max,
        d: max.subtract(min),
        multiplier: new Vector3(1,1,1)
    };
    options.boundInfo = boundInfo;
    options.box.draw = false;
    options.axis.x.labels.draw = false;
    options.axis.y.labels.draw = false;
    options.axis.x.rulers.draw = false;
    options.axis.y.rulers.draw = false;
    return {
        options,
        charts: chartsPie,
        x: valuesPie.x,
        y: valuesPie.y,
        // x: values3d.x,
        // y: values3d.y,
        // z: values3d.z,
    };

    // default
    // return {
    //     options,
    //     charts: charts,
    //     x: valuesPie.x,
    //     y: valuesPie.y,
    // };

    // enhanced
    // return {
    //     options,
    //     charts: charts2,
    //     x: values3d.x,
    //     y: values3d.y,
    //     z: values3d.z,
    // };
}
