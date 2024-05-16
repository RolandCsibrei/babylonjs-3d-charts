import { CreateGreasedLine } from "@babylonjs/core/Meshes/Builders/greasedLineBuilder";
import { ChartData, ChartDataBoundInfo } from "../model";
import { GreasedLineRibbonPointsMode } from "@babylonjs/core/Meshes/GreasedLine/greasedLineBaseMesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { includeInGlow } from "../effects/glowEffect";
import { Scene } from "@babylonjs/core";

export function drawLineWithAreaChart(
    data: ChartData,
    xValues: number[],
    yValues: number[],
    boundInfo: ChartDataBoundInfo,
    chart: ChartData,
    dz: number,
    scene: Scene
) {
    if (!chart.draw) {
        return;
    }

    // draw values
    const linePoints = [];
    const linePointsLower = [];
    for (let i = 0; i < xValues.length - 1; i++) {
        linePoints.push(xValues[i], yValues[i], dz);
        linePointsLower.push(xValues[i], 0, dz);
    }

    const line = CreateGreasedLine(
        chart.name,
        {
            points: [linePoints, linePointsLower],
            ribbonOptions: {
                pointsMode: GreasedLineRibbonPointsMode.POINTS_MODE_PATHS,
            },
        },
        {
            color: chart.color,
            width: chart.thickness,
        }
    );

    const parent = new TransformNode(chart.name, scene);
    line.parent = parent;

    line.renderingGroupId = chart.group;
    line.material && (line.material.alpha = chart.alpha);

    chart.glow && includeInGlow(line);
}
