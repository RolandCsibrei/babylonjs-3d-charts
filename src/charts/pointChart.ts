import { CreateSphere, Scene, StandardMaterial, TransformNode } from "@babylonjs/core";
import { ChartData, ChartDataBoundInfo, ZValues } from "../model";
import { includeInGlow } from "../effects/glowEffect";
import { getPositionNormalizers } from "../utils/helpers";

    export function drawPointChart(
        data: ChartData,
        xValues: number[],
        yValues: number[],
        zValues: ZValues,
        boundInfo: ChartDataBoundInfo,
        chart: ChartData,
        dz: number,
        scene: Scene
    ) {
        if (!chart.draw) {
            return;
        }
        const parent = new TransformNode(chart.name, scene);
        const positionNormalizers = getPositionNormalizers(data, xValues, yValues, zValues)
        for (let i = 0; i < xValues.length; i++) {
            const sphereMaterial = new StandardMaterial(
                "sphere-material",
                scene
            );
            sphereMaterial.emissiveColor = chart.color;

            const sphere = CreateSphere(chart.name, {
                diameter: chart.diameter,
                segments: chart.segments,
            });
            sphere.position.x = xValues[i] * positionNormalizers.x;
            sphere.position.y = yValues[i] * positionNormalizers.y;
            sphere.position.z = dz * positionNormalizers.z;

            sphere.material = sphereMaterial;
            sphere.parent = parent;

            sphere.renderingGroupId = chart.group;
            sphere.material.alpha = chart.alpha;

            chart.glow && includeInGlow(sphere)
        }
    }