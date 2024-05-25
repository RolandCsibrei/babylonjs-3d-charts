import { Scene } from "@babylonjs/core";
import { getDz } from "../utils/bounds";
import { isXYZ } from "../utils/helpers";
import { ChartData, ChartDataBoundInfo } from "../model";
import { drawLineChart } from "../charts/lineChart";
import { drawBoxChart } from "../charts/boxChart";
import { drawPointChart } from "../charts/pointChart";
import { drawAreaChart } from "../charts/areaChart";
import { drawPlaneChart } from "../charts/3d/planeChart";
import { drawPlaneWireframeChart } from "../charts/3d/planeWireframeChart";
import { drawPieChart } from "../charts/3d/pieChart";

export function drawValues(
    data: ChartData,
    boundInfo: ChartDataBoundInfo,
    scene: Scene
) {
    if (isXYZ(data)) {
        for (let i = 0; i < data.z.values.length; i++) {
            const xValues = data.x.values[i];
            const yValues = data.y.values[i];
            const dx = boundInfo.d.x;
            const dy = boundInfo.d.y;
            const dz = i
            drawValuesWithChart(data, xValues, yValues, boundInfo, dz, scene);
        }
    } else {
        const xValues = data.x.values;
        const yValues = data.y.values;

        const dx = boundInfo.d.x;
        const dy = boundInfo.d.y;
        const dz = getDz(data, boundInfo);
        drawValuesWithChart(data, xValues, yValues, boundInfo, dz, scene);
    }
}

function drawValuesWithChart(
    data: ChartData,
    xValues: number[],
    yValues: number[],
    boundInfo: ChartDataBoundInfo,
    dz: number,
    scene: Scene
) {
    const charts = data.charts;
    for (const chart of charts) {
        if (chart.draw) {
            switch (chart.type) {
                case "pie":
                    drawPieChart(
                        data,
                        xValues,
                        yValues,
                        boundInfo,
                        chart,
                        dz,
                        scene
                    );
                    break;
                case "line":
                    drawLineChart(
                        data,
                        xValues,
                        yValues,
                        boundInfo,
                        chart,
                        dz,
                        scene
                    );
                    break;
                case "box":
                    drawBoxChart(
                        data,
                        xValues,
                        yValues,
                        boundInfo,
                        chart,
                        dz,
                        scene
                    );
                    break;
                case "point":
                    drawPointChart(
                        data,
                        xValues,
                        yValues,
                        boundInfo,
                        chart,
                        dz,
                        scene
                    );
                    break;
                case "line-area":
                    drawAreaChart(
                        data,
                        xValues,
                        yValues,
                        boundInfo,
                        chart,
                        dz,
                        scene
                    );
                    break;
                case "plane":
                    drawPlaneChart(
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
                case "plane-wireframe":
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
    }
}
