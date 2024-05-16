import { CreateGreasedLine } from "@babylonjs/core/Meshes/Builders/greasedLineBuilder";
import { ChartData, ChartDataBoundInfo } from "../model";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { includeInGlow } from "../effects/glowEffect";
import { Scene } from "@babylonjs/core";

    export function drawLineChart(
        data: ChartData,
        xValues: number[],
        yValues: number[],
        boundInfo: ChartDataBoundInfo,
        chart: ChartData,
        dz: number,
        scene: Scene
    ) {
        // draw values
        const linePoints = [];
        for (let i = 0; i < xValues.length - 2; i++) {
            linePoints.push([
                xValues[i],
                yValues[i],
                dz,
                xValues[i + 1],
                yValues[i + 1],
                dz,
            ]);
        }

        const line = CreateGreasedLine(
            chart.name,
            {
                points: linePoints,
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

        chart.glow && includeInGlow(line)

    }