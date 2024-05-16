import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3, CreateGreasedLine, CreateText, Scene } from "@babylonjs/core";
import MyEarcut from "earcut";

import { getDz } from "../utils/bounds";
import { _getFont } from "../text/text";
import { ChartData, ChartDataBoundInfo } from "../model";

import { excludeFromGlow } from "../effects/glowEffect";
import { isXYZ } from "../utils/helpers";

   export function _drawMarkersOnAxis(data: ChartData, boundInfo: ChartDataBoundInfo, scene: Scene) {
        const minX = boundInfo.min.x;
        const maxX = boundInfo.max.x;
        const minY = boundInfo.min.y;
        const maxY = boundInfo.max.y;

        const dz = getDz(data, boundInfo);

        const fontInfo = _getFont(
            data.options.axis.x.labels.fontStyle,
            data
        );

        const labelMaterial = new StandardMaterial(
            "label-material",
            scene
        );
        labelMaterial.emissiveColor = Color3.White();

        // draw Axis Markers
        const stepX = 1;
        for (let x = minX; x <= maxX; x += stepX) {
            if (data.options.axis.x.rulers.draw) {
                CreateGreasedLine(
                    "xv",
                    {
                        points: [x, 0, 0, x, 0, dz],
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

            if (data.options.axis.x.labels.draw) {
                const size = 0.3;
                const xLabel = CreateText(
                    "x-label",
                    `${x}`,
                    fontInfo.fontData,
                    fontInfo.fontStyle,
                    scene,
                    MyEarcut
                );

                if (xLabel) {
                    xLabel.material = labelMaterial;
                    xLabel.position.x = x;
                    xLabel.position.y -= size / 2;
                    xLabel.position.z -= 0.5;
                    xLabel.renderingGroupId = 3;

                    excludeFromGlow(xLabel)
                }
            }
        }

        const stepY = 1;
        for (let y = minY; y <= maxY; y += stepY) {
            if (data.options.axis.y.rulers.draw) {
                CreateGreasedLine(
                    "yv",
                    {
                        points: [0, y, 0, 0, y, dz],
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
                const label = Math.round(y * 1000) / 1000;
                const yLabel = CreateText(
                    "y-label",
                    `${label}`,
                    fontInfo.fontData,
                    fontInfo.fontStyle,
                    scene,
                    MyEarcut
                );
                if (yLabel) {
                    yLabel.material = labelMaterial;
                    yLabel.position.x -= size / 2;
                    yLabel.position.y = y;
                    yLabel.position.z -= 0.5;
                    yLabel.renderingGroupId = 3;

                    excludeFromGlow(yLabel)
                }
            }
        }

        // draw Z axis if needed
        if (isXYZ(data)) {
            const minZ = boundInfo.min.z;
            const maxZ = boundInfo.max.z;
            const stepZ = 1;
            for (let z = 0; z <= maxZ; z += stepZ) {
                if (data.options.axis.z.rulers.draw) {
                    CreateGreasedLine(
                        "zv",
                        {
                            points: [minX, 0, z, maxX, 0, z],
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

                if (data.options.axis.z.labels.draw) {
                    const size = 0.3;
                    const label = Math.round(z * 1000) / 1000;
                    const zLabel = CreateText(
                        "z-label",
                        `${label}`,
                        fontInfo.fontData,
                        fontInfo.fontStyle,
                        scene,
                        MyEarcut
                    );
                    if (zLabel) {
                        zLabel.material = labelMaterial;
                        zLabel.position.x = maxX;
                        zLabel.position.y = 0;
                        zLabel.position.z = z;
                        zLabel.renderingGroupId = 3;

                        excludeFromGlow(zLabel)
                    }
                }
            }
        }
    }
