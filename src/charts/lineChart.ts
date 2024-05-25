import { CreateGreasedLine } from "@babylonjs/core/Meshes/Builders/greasedLineBuilder";
import { ChartData, ChartDataBoundInfo, ZValues } from "../model";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { includeInGlow } from "../effects/glowEffect";
import { Scene } from "@babylonjs/core";
import { getPositionNormalizers } from "../utils/helpers";

    export function drawLineChart(
        data: ChartData,
        xValues: number[],
        yValues: number[],
        zValues: ZValues,
        boundInfo: ChartDataBoundInfo,
        chart: ChartData,
        dz: number,
        scene: Scene
    ) {
        const linePoints = [];
        const positionNormalizers = getPositionNormalizers(
            data,
            xValues,
            yValues,
            zValues
        );

        for (let i = 0; i < xValues.length - 1; i++) {
            linePoints.push([
                xValues[i] * positionNormalizers.x,
                yValues[i] * positionNormalizers.y,
                dz * positionNormalizers.z,
                xValues[i + 1] * positionNormalizers.x,
                yValues[i + 1] * positionNormalizers.y,
                dz * positionNormalizers.z,
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