import {
    AdvancedDynamicTexture,
    Button,
    Control,
    Line,
    Rectangle,
    StackPanel,
    TextBlock,
} from "@babylonjs/gui";
import { Chart, ChartData } from "../model";
import { AbstractMesh, CreateSphere, Mesh, Scene } from "@babylonjs/core";
import { getFont, createText } from "../text/text";
import { getDirection } from "../utils/helpers";

export function drawLegend(
    data: ChartData,
    chart: Chart,
    gui: AdvancedDynamicTexture,
    meshes: AbstractMesh[]
) {
    const stackPanel = new StackPanel("buttons-" + chart.name);
    stackPanel.isVertical = true;
    stackPanel.width = 0.2;
    let activeIndex = -1;
    for (let i = 0; i < chart.labels.length; i++) {
        const button = new Button("button-" + i);
        button.widthInPixels = 240;
        button.heightInPixels = 72;
        button.thickness = 0;

        const rectangle = new Rectangle("rectangle-" + i);
        rectangle.widthInPixels = 64;
        rectangle.heightInPixels = 64;
        rectangle.background = chart.color[i];
        rectangle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        rectangle.cornerRadius = 4;

        const textBlock = new TextBlock("textblock" + i);
        textBlock.text = chart.labels[i];
        textBlock.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        textBlock.color = "white";

        button.addControl(rectangle);
        button.addControl(textBlock);

        button.onPointerClickObservable.add(() => {
            if (i === activeIndex) {
                for (let j = 0; j < meshes.length; j++) {
                    meshes[j].material!.alpha = chart.alpha;
                }
                activeIndex = -1;
            } else {
                for (let j = 0; j < meshes.length; j++) {
                    meshes[j].material!.alpha = 0.1;
                }
                activeIndex = i;
                meshes[i].material!.alpha = 1;
            }
        });

        stackPanel.addControl(button);
    }
    stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    stackPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    gui.addControl(stackPanel);
}

export function drawLabelsOnChart(
    data: ChartData,
    chart: Chart,
    meshes: Mesh[],
    scene: Scene
) {
    for (let i = 0; i < chart.labels.length; i++) {
        const fontInfo = getFont("default", data, { size: 0.4, depth: 0.2 });

        const text = createText(
            "on-chart-label" + i,
            `${data.x.values[i]}`,
            fontInfo,
            scene
        );

        if (text) {
            const bb = meshes[i].getBoundingInfo();
            text.setParent(meshes[i]);
            if (bb) {
                const position = bb.boundingBox.center;
                text.position = position;
                text.rotation.x = Math.PI / 2;
                text.position.y +=
                    (data.y.values[i] / 2) * chart.verticalFactor; // TODO
            }
            // Mesh.MergeMeshes([meshes[i], text])
        }
    }

    // scene.onBeforeRenderObservable.add(() => {

    // })
}

export function drawCharLinkedLabels(
    data: ChartData,
    chart: Chart,
    gui: AdvancedDynamicTexture,
    meshes: Mesh[]
) {
    for (let i = 0; i < chart.labels.length; i++) {
        const direction = getDirection(meshes[i]);

        const stackPanel = new StackPanel("buttons-" + chart.name);
        stackPanel.isVertical = true;
        stackPanel.width = 0.2;

        stackPanel.linkOffsetY =
            data.y.values[i] * chart.verticalFactor * direction.y;
        stackPanel.linkOffsetX = chart.radius * direction.x;
        // stackPanel.overlapGroup = 1;

        const button = new Button("button-" + i);
        button.widthInPixels = 120;
        button.heightInPixels = 42;
        button.thickness = 1;
        button.background = "black";
        button.cornerRadius = 4;

        // const rectangle = new Rectangle("rectangle-" + i);
        // rectangle.widthInPixels = 64;
        // rectangle.heightInPixels = 64;
        // rectangle.background = chart.color[i];
        // rectangle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        // rectangle.cornerRadius = 4;
        // rectangle.linkOffsetYInPixels = -60; // *  this.devicePixelRatio;

        const textBlock = new TextBlock("textblock" + i);
        textBlock.text = chart.labels[i];
        // textBlock.heightInPixels = 40
        textBlock.color = "white";

        const line = new Line();
        line.name = `line-${i}`;
        line.lineWidth = 4;
        line.color = "#444";
        line.connectedControl = textBlock;
        line.linkOffsetY =
            data.y.values[i] * chart.verticalFactor * direction.y; // * this.devicePixelRatio;
        line.linkOffsetX = chart.radius * direction.x;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        gui.addControl(line);
        line.linkWithMesh(meshes[i]);

        line.y2 = 0;
        //   line.dash = [3 * this.devicePixelRatio, 3 * this.devicePixelRatio];
        line.dash = [3, 3];

        // button.addControl(rectangle);
        button.addControl(textBlock);
        stackPanel.addControl(button);

        gui.addControl(stackPanel);
        stackPanel.linkWithMesh(meshes[i]);

        //
    }
}
