import { Scene } from "@babylonjs/core";
import { getDz } from "../utils/bounds";
import { isXYZ } from "../utils/helpers";
import { Chart, ChartData, ChartDataBoundInfo, ZValues } from "../model";

export function drawValues(
    data: ChartData,
    boundInfo: ChartDataBoundInfo,
    scene: Scene
) {
    // const chartNames = [
    //     ["point-chart2", "line-chart",  "line-area-chart"],
    //     ["line-chart"],
    //     ["box-chart", "line-chart"],
    //     ["line-area-chart", "point-chart"],
    //     ["line-area-chart2", "point-chart2"],
    // ];
    // const chartNames = [
    //     ["plane-chart", "wireframeplane-chart"],
    //     [],
    //     ["point-chart2", "box-chart2"],
    // ];
    // const chartNames = [
    //     ["point-chart2"],
    //     ["plane-chart"],

    //     [],
    //     ["point-chart2"],
    // ];
    // , "wireframeplane-chart"],
    //     [],
    //     ["point-chart2"],
    // ];

    // const chartNames = [["pie-chart"]];
    const chartNames = [
        ["point-chart", "line-chart"],
        ["point-chart2"],
        ["point-chart"],
    ];
    const charts = data.charts;
    for (let i = 0; i < data.z.values.length; i++) {
        const chartGroup = chartNames[i] ?? chartNames[chartNames.length - 1];
        for (let j = 0; j < chartGroup.length; j++) {
            const chart = charts.find((c: Chart) => c.name === chartGroup[j]);

            if (!chart) {
                continue;
            }

            if (isXYZ(data)) {
                const xValues = data.x.values[i];
                const yValues = data.y.values[i];
                const zValues = data.z.values;
                const dx = boundInfo.d.x;
                const dy = boundInfo.d.y;
                const dz  = i
                drawValuesWithChart(
                    chart,
                    data,
                    xValues,
                    yValues,
                    zValues,
                    boundInfo,
                    dz,
                    scene
                );
            } else {
                const xValues = data.x.values;
                const yValues = data.y.values;
                const zValues:number[] = []
                const dx = boundInfo.d.x;
                const dy = boundInfo.d.y;
                const dz = getDz(data, boundInfo);
                drawValuesWithChart(
                    chart,
                    data,
                    xValues,
                    yValues,
                    zValues,
                    boundInfo,
                    dz,
                    scene
                );
            }
        }
    }
}

async function drawValuesWithChart(
    chart: Chart,
    data: ChartData,
    xValues: number[],
    yValues: number[],
    zValues: ZValues,
    boundInfo: ChartDataBoundInfo,
    dz: number,
    scene: Scene
) {
    switch (chart.type) {
        case "pie":
            const { drawPieChart } = await import("../charts/3d/pieChart");
            drawPieChart(data, xValues, yValues, boundInfo, chart, dz, scene);
            chart.drawn = true;
            break;
        case "line":
            const { drawLineChart } = await import("../charts/lineChart");
            drawLineChart(data, xValues, yValues, zValues, boundInfo, chart, dz, scene);
            break;
        case "box":
            const { drawBoxChart } = await import("../charts/boxChart");
            drawBoxChart(data, xValues, yValues, boundInfo, chart, dz, scene);
            break;
        case "point":
            const { drawPointChart } = await import("../charts/pointChart");
            drawPointChart(data, xValues, yValues, zValues, boundInfo, chart, dz, scene);
            break;
        case "line-area":
            const { drawAreaChart } = await import("../charts/areaChart");
            drawAreaChart(data, xValues, yValues, boundInfo, chart, dz, scene);
            break;
        case "plane":
            const { drawPlaneChart } = await import("../charts/3d/planeChart");
            drawPlaneChart(data, xValues, yValues, boundInfo, chart, dz, scene);
            chart.drawn = true;
            break;
        case "plane-wireframe":
            const { drawPlaneWireframeChart } = await import(
                "../charts/3d/planeWireframeChart"
            );
            drawPlaneWireframeChart(
                data,
                xValues,
                yValues,
                boundInfo,
                chart,
                dz,
                scene
            );
            chart.drawn = true;
            break;
    }
}
