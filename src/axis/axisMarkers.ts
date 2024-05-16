import {
    Color3,
    CreateGreasedLine,
    CreateText,
    Scene,
    StandardMaterial,
} from "@babylonjs/core";
import { getDz } from "../utils/bounds";
import { _getFont } from "../text/text";
import { ChartData, ChartDataBoundInfo } from "../model";
import { excludeFromGlow } from "../effects/glowEffect";

import MyEarcut from "earcut";

export function _drawValueMarkersOnAxis(
    data: ChartData,
    boundInfo: ChartDataBoundInfo,
    scene: Scene
) {
    const xValues = data.x.values;
    const dz = getDz(data, boundInfo);

    const fontInfo = _getFont(data.options.axis.x.labels.fontStyle, data);

    const labelMaterial = new StandardMaterial("label-material", scene);
    labelMaterial.emissiveColor = Color3.White();

    for (const v of xValues) {
        if (data.options.axis.x.rulers.draw) {
            CreateGreasedLine(
                "xv",
                {
                    points: [v, 0, 0, v, 0, dz],
                },
                {
                    width: data.options.axis.x.rulers.thickness,
                    useDash: true,
                    dashCount: dz * 2,
                    dashRatio: 0.2,
                    color: data.options.axis.x.rulers.color,
                }
            );
        }

        if (data.options.axis.x.labels.draw) {
            const size = 0.3;
            const xLabel = CreateText(
                "x-label",
                `${v}`,
                fontInfo.fontData,
                fontInfo.fontStyle,
                scene,
                MyEarcut
            );

            if (xLabel) {
                xLabel.material = labelMaterial;
                xLabel.position.x = v;
                xLabel.position.y -= size / 2;
                xLabel.position.z -= 0.2;

                excludeFromGlow(xLabel);
            }
        }
    }

    const yValues = data.y.values;
    for (const v of yValues) {
        if (data.options.axis.y.rulers.draw) {
            CreateGreasedLine(
                "xv",
                {
                    points: [0, v, 0, 0, v, dz],
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

        if (data.options.axis.y.labels.draw) {
            const size = 0.3;
            const yLabel = CreateText(
                "y-label",
                `${v}`,
                fontInfo.fontData,
                fontInfo.fontStyle,
                scene,
                MyEarcut
            );

            if (yLabel) {
                yLabel.material = labelMaterial;
                yLabel.position.x -= size / 2;
                yLabel.position.y = v;
                yLabel.position.z -= 0.2;

                excludeFromGlow(yLabel)
            }
        }
    }
}
