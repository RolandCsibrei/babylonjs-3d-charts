import { CreateSphere, Scene, StandardMaterial, TransformNode } from "@babylonjs/core";
import { ChartData, ChartDataBoundInfo } from "../model";
import { includeInGlow } from "../effects/glowEffect";

    export function drawPointChart(
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
            const sphereMaterial = new StandardMaterial(
                "sphere-material",
                scene
            );
            sphereMaterial.emissiveColor = chart.color;

            const sphere = CreateSphere(chart.name, {
                diameter: chart.diameter,
                segments: chart.segments,
            });
            sphere.position.x = xValues[i];
            sphere.position.y = yValues[i];
            sphere.position.z = dz;

            sphere.material = sphereMaterial;
            sphere.parent = parent;

            sphere.renderingGroupId = chart.group;
            sphere.material.alpha = chart.alpha;

            chart.glow && includeInGlow(sphere)
        }
    }