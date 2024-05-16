import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Scalar } from "@babylonjs/core/Maths/math.scalar";

   export function getData() {
        const options = {
            fonts: [
                {
                    name: "droid",
                    url: "https://assets.babylonjs.com/fonts/Droid Sans_Regular.json",
                },
            ],
            fontStyles: {
                "droid-big": {
                    fontName: "droid",
                    size: 1,
                    resolution: 16,
                    depth: 0.02,
                },
                "droid-small": {
                    fontName: "droid",
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
            },
            box: {
                draw: true,
                color: Color3.Gray(),
                thickness: 0.01,
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
                        thickness: 0.01,
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
                        thickness: 0.01,
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
                        thickness: 0.01,
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
                draw: true,
                color: Color3.Red(),
                diameter: 0.2,
                segments: 8,
                glow: false,
                alpha: 1,
                group: 2,
            },
            {
                type: "plane",
                name: "plane-chart",
                draw: true,
                color: Color3.Yellow(),
                colorMode: "multiply", // multiply, add, set
                smooth: false,
                glow: false,
                alpha: 1,
                group: 2,
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
                group: 2,
            },
        ];

        const values = {
            x: {
                values: [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21, 22,
                    23, 28,
                ],
            },
            y: {
                values: [
                    7, 8, 8.4, 8.8, 6, 3, 2, 0.5, 5, 6, 6.2, 7, 7.3, 9, 10, 8,
                    6, 6, 5.5, 4, 7, 8, 9,
                ],
            },
        };

        const values3d = {
            x: {
                values: [
                    [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21,
                        22, 23, 28,
                    ],
                    [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21,
                        22, 23, 28,
                    ],
                    [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21,
                        22, 23, 28,
                    ],
                    [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21,
                        22, 23, 28,
                    ],
                    [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 18, 20, 21,
                        22, 23, 28,
                    ],
                ],
            },
            y: {
                values: [
                    [
                        7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10,
                        8, 6, 6, 5.5, 4, 7, 8, 9,
                    ],
                    [
                        7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10,
                        8, 6, 6, 5.5, 4, 7, 8, 9,
                    ],
                    [
                        7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10,
                        8, 6, 6, 5.5, 4, 7, 8, 9,
                    ],
                    [
                        7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10,
                        8, 6, 6, 5.5, 4, 7, 8, 9,
                    ],
                    [
                        7, 8, 8.4, 8.8, 6, 4, 5, 3.5, 5, 6, 6.2, 7, 7.3, 9, 10,
                        8, 6, 6, 5.5, 4, 7, 8, 9,
                    ],
                ],
            },
            z: {
                values: [0, 4, 8, 12, 16],
            },
        };

        // randomize data
        for (let i = 0; i < values3d.y.values.length; i++) {
            for (let j = 0; j < values3d.y.values[i].length; j++) {
                values3d.y.values[i][j] += Scalar.RandomRange(-2, 4);
            }
        }

        return {
            options,
            charts,
            // x: values.x,
            // y: values.y,
            x: values3d.x,
            y: values3d.y,
            z: values3d.z,
        };
    }
