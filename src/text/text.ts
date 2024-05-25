import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import {
    ChartData,
    ChartDataBoundInfo,
    Font,
    FontStyleInfo,
    FontStyleOverride,
} from "../model";
import { getDz } from "../utils/bounds";
import { CreateText, Mesh, type Scene } from "@babylonjs/core";
import MyEarcut from "earcut";
import { excludeFromGlow } from "../effects/glowEffect";

const _fontData: Map<string, any> = new Map();

export function drawChartMainLabel(
    data: ChartData,
    boundInfo: ChartDataBoundInfo,
    scene: Scene
) {
    if (data.options.label?.draw) {
        const overrides = data.options.label.fontStyleOverrides;
        const font = getFont(data.options.label.fontStyle, data, overrides);
        const titleLabel = createText(
            "chart-main-label",
            data.options.label.text,
            font,
            scene
        );

        if (titleLabel) {
            const material = new StandardMaterial("label-material", scene);
            if (!data.options.label.unlit) {
                material.emissiveColor = data.options.label.color;
            } else {
                material.diffuseColor = data.options.label.color;
            }

            titleLabel.material = material;

            // const dx = boundInfo.d.x;
            // const dy = boundInfo.d.y;
            // const dz = getDz(data, boundInfo);

            // titleLabel.position.x = dx / 2;
            // titleLabel.position.y = dy + 0.1;
            // titleLabel.position.z = dz;

            if (data.options.label.offset) {
                titleLabel.position.x += data.options.label.offset[0];
                titleLabel.position.y += data.options.label.offset[1];
                titleLabel.position.z += data.options.label.offset[2];
            }

            if (data.options.label.billboardMode) {
                titleLabel.billboardMode = Mesh.BILLBOARDMODE_ALL
            }

            excludeFromGlow(titleLabel);
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

export function getFont(
    fontStyle: string,
    data: ChartData,
    fontStyleOverrides: FontStyleOverride = {}
): Font {
    const fontStyleData = {
        ...(data.options.fontStyles[fontStyle] as FontStyleInfo),
        ...fontStyleOverrides,
    };

    //     size: options?.size ?? font.fontStyle.size,
    // resolution:
    //     options?.resolution ?? font.fontStyle.resolution,
    // depth: options?.depth ?? font.fontStyle.depth,
    return {
        fontData: _fontData.get(fontStyleData.fontName),
        fontStyle: fontStyleData,
    };
}

export function createText(
    name: string,
    text: string,
    fontInfo: Font,
    scene: Scene
) {
    const text3d = CreateText(
        name,
        `${text}`,
        fontInfo.fontData,
        fontInfo.fontStyle,
        scene,
        MyEarcut
    );
    return text3d;
}
