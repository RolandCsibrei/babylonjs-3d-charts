import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3, CreateGreasedLine, Scene } from "@babylonjs/core";

import { getDz, getPositionsOnAxes } from "../utils/bounds";
import { createText, getFont } from "../text/text";
import { ChartData, ChartDataBoundInfo, FontStyleInfo } from "../model";

import { excludeFromGlow } from "../effects/glowEffect";
import { getLongestValuesLengths, getMinMax, getPositionNormalizers, isXYZ } from "../utils/helpers";

export function drawMarkersOnAxis(
    data: ChartData,
    boundInfo: ChartDataBoundInfo,
    scene: Scene
) {

    // const axisPoints = getPositionsOnAxes(data);
    const longestValues = getLongestValuesLengths(data)
    debugger
    const positionNormalizers = getPositionNormalizers(data, longestValues.x, longestValues.y, longestValues.z)
    const dimensions = data.options.dimensions;

    const minX = boundInfo.min.x;
    const maxX = boundInfo.max.x;
    const minY = boundInfo.min.y;
    const maxY = boundInfo.max.y;

    const dz = getDz(data, boundInfo);

    const fontInfo = getFont(data.options.axis.x.labels.fontStyle, data);

    const labelMaterial = new StandardMaterial("label-material", scene);
    labelMaterial.emissiveColor = Color3.White();
    // draw Axis Markers
    //  boundInfo.multiplier.x;
    const points = [];
    for (let i = 0; i < longestValues.x.length; i++) {
        const x = longestValues.x[i];
        // const lineX = axisPoints.positions.x[i];
        const lineX = i * positionNormalizers.x
        points.push([lineX, 0, 0, lineX, 0, dimensions.z]);
        points.push([
            lineX,
            0,
            dimensions.z,
            lineX,
            dimensions.y,
            dimensions.z,
        ]);

        if (data.options.axis.x.labels.draw) {
            const size = 0.3;
            const xLabel = createText("x-label", `${x}`, fontInfo, scene);

            if (xLabel) {
                xLabel.material = labelMaterial;
                xLabel.position.x = lineX;
                xLabel.position.y -= size / 2;
                xLabel.position.z -= 0.5;
                xLabel.renderingGroupId = 3;

                excludeFromGlow(xLabel);
            }
        }
    }

    if (data.options.axis.x.rulers.draw) {
        CreateGreasedLine(
            "xv",
            {
                points,
            },
            {
                width: data.options.axis.y.rulers.thickness,
                useDash: true,
                dashCount: dz * 2,
                dashRatio: 0.2,
                color: data.options.axis.x.rulers.color,
            }
        );
    }

    //

    // const stepY = data.options.dimensions.y / data.y.values.length; // boundInfo.multiplier.y;
    points.length = 0;
    const sorted = longestValues.y.slice().sort()
    const { min, max } = getMinMax(data.y.values)
    const stepY = max / longestValues.y.length
    let y = 0
    for (let i = 0; i < longestValues.y.length; i++) {
        const lineY = i //* positionNormalizers.y
        points.push([0, lineY, 0, 0, lineY, dimensions.z]);
        points.push([
            0,
            lineY,
            dimensions.z,
            dimensions.x,
            lineY,
            dimensions.z,
        ]);

        if (data.options.axis.y.labels.draw) {
            const size = 0.3;
            const label = Math.ceil(y);
            const yLabel = createText("y-label", `${label}`, fontInfo, scene);
            if (yLabel) {
                yLabel.material = labelMaterial;
                yLabel.position.x -= size / 2;
                yLabel.position.y = lineY;
                yLabel.position.z -= 0.5;
                yLabel.renderingGroupId = 3;

                excludeFromGlow(yLabel);
            }

            y += stepY;
        }
    }

    if (data.options.axis.y.rulers.draw) {
        CreateGreasedLine(
            "yv",
            {
                points,
            },
            {
                width: data.options.axis.y.rulers.thickness,
                useDash: true,
                dashCount: dz * 2,
                dashRatio: 0.2,
                color: data.options.axis.y.rulers.color,
            }
        );
    }

    // draw Z axis if needed
    if (isXYZ(data)) {
        points.length = 0;
        const minZ = boundInfo.min.z;
        const maxZ = boundInfo.max.z;
        for (let i = 0; i < longestValues.z.length; i++) {
            const z = longestValues.z[i]
            // const lineZ = axisPoints.positions.z[i];
            const lineZ = i * positionNormalizers.z
            points.push([0, 0, lineZ, dimensions.x, 0, lineZ]);
            points.push([0, 0, lineZ, 0, dimensions.y, lineZ]);

            if (data.options.axis.z.labels.draw) {
                const size = 0.3;
                const label = Math.round(z * 1000) / 1000;
                const zLabel = createText(
                    "z-label",
                    `${label}`,
                    fontInfo,
                    scene
                );
                if (zLabel) {
                    zLabel.material = labelMaterial;
                    zLabel.position.x = dimensions.x // maxX;
                    zLabel.position.y = 0;
                    zLabel.position.z = lineZ;
                    zLabel.renderingGroupId = 3;

                    excludeFromGlow(zLabel);
                }

            }
        }

        if (data.options.axis.z.rulers.draw) {
            CreateGreasedLine(
                "zv",
                {
                    points,
                },
                {
                    width: data.options.axis.z.rulers.thickness,
                    useDash: true,
                    dashCount: dz * 2,
                    dashRatio: 0.2,
                    color: data.options.axis.z.rulers.color,
                }
            );
        }
    }
}
