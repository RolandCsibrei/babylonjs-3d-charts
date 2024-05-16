import {
    GreasedLineMeshColorDistributionType,
    GreasedLineMeshColorMode,
} from "@babylonjs/core/Materials/GreasedLine/greasedLineMaterialInterfaces";
import { ChartData, ChartDataBoundInfo } from "../../model";
import {
    CreateGreasedLine,
    GreasedLineMeshColorDistribution,
} from "@babylonjs/core/Meshes/Builders/greasedLineBuilder";
import { GreasedLineRibbonPointsMode } from "@babylonjs/core/Meshes/GreasedLine/greasedLineBaseMesh";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { includeInGlow } from "../../effects/glowEffect";
import { Scene } from "@babylonjs/core";

export function drawPlaneChart(
    data: ChartData,
    xValues: number[],
    yValues: number[],
    boundInfo: ChartDataBoundInfo,
    chart: ChartData,
    dz: number,
    scene: Scene
) {
    if (!chart.draw || chart.drawn) {
        return;
    }

    // draw values
    const paths = [];
    for (let i = 0; i < data.z.values.length; i++) {
        const linePoints = [];
        // const dz = (data.options.box.depth / (data.y.values.length + 1)) * i

        for (let j = 0; j < data.x.values[i].length; j++) {
            linePoints.push(
                data.x.values[i][j],
                data.y.values[i][j],
                data.z.values[i]
            );
        }
        paths.push(linePoints);
    }

    const colorMode =
        chart.colorMode === "multiply"
            ? GreasedLineMeshColorMode.COLOR_MODE_MULTIPLY
            : chart.colorMode === "add"
            ? GreasedLineMeshColorMode.COLOR_MODE_ADD
            : GreasedLineMeshColorMode.COLOR_MODE_SET;
    const line = CreateGreasedLine(
        chart.name,
        {
            points: paths,
            ribbonOptions: {
                pointsMode: GreasedLineRibbonPointsMode.POINTS_MODE_PATHS,
                smoothShading: chart.smooth,
            },
        },
        {
            color: chart.color,
            useColors: true,
            colors: [Color3.Green(), Color3.Yellow(), Color3.Green()],
            colorDistribution:
                GreasedLineMeshColorDistribution.COLOR_DISTRIBUTION_REPEAT,
            colorDistributionType:
                GreasedLineMeshColorDistributionType.COLOR_DISTRIBUTION_TYPE_LINE,
            colorsSampling: Texture.LINEAR_LINEAR,
            colorMode,
        }
    );

    const parent = new TransformNode(chart.name, scene);
    line.parent = parent;

    line.renderingGroupId = chart.group;
    line.material && (line.material.alpha = chart.alpha);

    chart.glow && includeInGlow(line);
}
