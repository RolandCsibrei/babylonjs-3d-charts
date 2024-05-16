import { GreasedLineMeshColorMode } from "@babylonjs/core/Materials/GreasedLine/greasedLineMaterialInterfaces";
import { ChartData, ChartDataBoundInfo } from "../../model";
import { CreateGreasedLine } from "@babylonjs/core/Meshes/Builders/greasedLineBuilder";
import { includeInGlow } from "../../effects/glowEffect";
import { Scene } from "@babylonjs/core";

export function drawPlaneWireframeChart(
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

    const paths = [];
    for (let i = 0; i < data.z.values.length; i++) {
        const linePoints = [];
        for (let j = 0; j < data.x.values[i].length; j++) {
            linePoints.push(
                data.x.values[i][j],
                data.y.values[i][j],
                data.z.values[i]
            );
        }
        paths.push(linePoints);
    }

    for (let i = 0; i < data.y.values[0].length; i++) {
        const linePoints = [];
        for (let j = 0; j < data.z.values.length; j++) {
            const x = data.x.values[j][i];
            const y = data.y.values[j][i];

            linePoints.push(x, y, data.z.values[j]);
        }
        paths.push(linePoints);
    }

    const lineWireframe = CreateGreasedLine(
        chart.name + "-wireframe",
        {
            points: paths,
            // TODO
            // ribbonOptions: {}
        },
        {
            color: chart.color,
            colorMode: GreasedLineMeshColorMode.COLOR_MODE_SET,
            width: chart.width,

            // TODO
            // useDash: true,
            // dashCount: 30,
            // dashRatio: 0.2,
        }
    );
    lineWireframe.renderingGroupId = chart.group;
    lineWireframe.material && (lineWireframe.material.alpha = chart.alpha);

    lineWireframe.position.y += 0.05; // TODO

    chart.glow && includeInGlow(lineWireframe);
}
