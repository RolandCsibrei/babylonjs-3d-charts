import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { ChartData, ChartDataBoundInfo } from "../model";
import { CreateBox, Scene, StandardMaterial } from "@babylonjs/core";
import { includeInGlow } from "../effects/glowEffect";

export function drawBoxChart(
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

    const parent = new TransformNode(chart.name, scene);
    for (let i = 0; i < xValues.length - 1; i++) {
        const boxMaterial = new StandardMaterial("box-material", scene);
        boxMaterial.emissiveColor = chart.color;

        const box = CreateBox(chart.name, {
            width: chart.width,
            depth: chart.depth,
            height: yValues[i],
        });
        box.position.x = xValues[i];
        box.position.y = yValues[i] / 2;
        box.position.z = dz - chart.depth;

        box.material = boxMaterial;
        box.parent = parent;

        box.renderingGroupId = chart.group;
        box.material.alpha = chart.alpha;

        chart.glow && includeInGlow(box);
    }
}
