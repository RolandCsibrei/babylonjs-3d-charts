import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { ChartData, ChartDataBoundInfo, FontStyleInfo } from "../model";
import { getDz } from "../utils/bounds";
import { CreateText, Scene } from "@babylonjs/core";
import MyEarcut from "earcut";
import { excludeFromGlow } from "../effects/glowEffect";


const _fontData: Map<string, any> = new Map();

export function drawLabel(data: ChartData, boundInfo: ChartDataBoundInfo, scene: Scene) {
    if (data.options.label?.draw) {
        const fontInfo = _getFont(data.options.label.fontStyle, data);
        const titleLabel = CreateText(
            "chart-label",
            data.options.label.text,
            fontInfo.fontData,
            {
                size: fontInfo.fontStyle.size,
                resolution: fontInfo.fontStyle.resolution,
                depth: fontInfo.fontStyle.depth,
            },
            scene,
            MyEarcut
        );

        if (titleLabel) {
            const material = new StandardMaterial("label-material", scene);
            material.emissiveColor = data.options.label.color;

            titleLabel.material = material;

            const dx = boundInfo.d.x;
            const dy = boundInfo.d.y;
            const dz = getDz(data, boundInfo);

            titleLabel.position.x = dx / 2;
            titleLabel.position.y = dy + 0.1;
            titleLabel.position.z = dz;

            excludeFromGlow(titleLabel)
        }
    }
}

export async function setupFonts(data: ChartData) {
    const fonts = data.options.fonts;
    for (const font of fonts) {
        const url = font.url;
        const name = font.name;
        const fontData = await (await fetch(url)).json();
        _fontData.set(name, fontData);
    }
}

export function _getFont(fontStyle: string, data: ChartData) {
    const fontStyleData = data.options.fontStyles[fontStyle] as FontStyleInfo;
    return {
        fontData: _fontData.get(fontStyleData.fontName),
        fontStyle: fontStyleData,
    };
}
