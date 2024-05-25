import {
    GreasedLineMeshColorDistributionType,
    GreasedLineMeshColorMode,
} from "@babylonjs/core/Materials/GreasedLine/greasedLineMaterialInterfaces";
import { Chart, ChartData, ChartDataBoundInfo } from "../../model";
import {
    CreateGreasedLine,
    GreasedLineMeshColorDistribution,
} from "@babylonjs/core/Meshes/Builders/greasedLineBuilder";
import { GreasedLineRibbonPointsMode } from "@babylonjs/core/Meshes/GreasedLine/greasedLineBaseMesh";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { includeInGlow } from "../../effects/glowEffect";
import {
    ActionManager,
    CSG,
    CreateCylinder,
    DynamicTexture,
    GreasedLineTools,
    InterpolateValueAction,
    Mesh,
    Scene,
    StandardMaterial,
    Vector3,
    Vector4,
} from "@babylonjs/core";
import { arrayConcat, convertColor, getColors } from "../../utils/helpers";
import {
    drawCharLinkedLabels,
    drawLabelsOnChart,
    drawLegend,
} from "../../legends/legend";
import { AdvancedDynamicTexture } from "@babylonjs/gui";

/*
https://forum.babylonjs.com/t/candy-pie-a-configurable-interactive-3d-pie-chart-in-your-browser/32803
*/

function getCircleLinePoints(
    radiusX: number,
    segments: number,
    z = 0,
    radiusY = radiusX,
    segmentAngle = (Math.PI * 2) / segments,
    segmentAngleOffset = 0
) {
    const points: Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
        points.push(
            new Vector3(
                Math.cos(i * segmentAngle + segmentAngleOffset) * radiusX,
                z,
                Math.sin(i * segmentAngle + segmentAngleOffset) * radiusY
            )
        );
    }
    return points;
}

export function drawPieChart(
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

    const gui = AdvancedDynamicTexture.CreateFullscreenUI("gui");

    const nonOvrlapObs = scene.onBeforeRenderObservable.add(() => {
        gui.moveToNonOverlappedPosition();
    });

    setTimeout(() => {
        scene.onBeforeRenderObservable.remove(nonOvrlapObs)
    }, 2000)

    const length = data.x.values.length;
    const colors = getColors(chart.color, length);
    const slices = [];
    for (let i = 0; i < length; i++) {
        const slice = {
            value: data.y.values[i],
            arcPct: data.x.values[i],
            color: colors[i],
            label: chart.labels[i] ?? "",
        };
        slices.push(slice);
    }

    const pie3d: any = {
        htmlCanvasId: "no-need-in-playground",
        innerRadiusPct: 20,

        // == label options ==
        showLabel: true,
        //'showValue': false,
        //'labelFontFactor': 1,
        // 'labelExtraTopMargin': 0,
        // 'labelColor': '',
    };

    pie3d.slices = slices;

    createSlices(pie3d);

    const meshes = pieChart(pie3d, data, chart, gui);

    drawLegend(data, chart, gui, meshes);

    // drawCharLinkedLabels(data, chart, gui, meshes);
    drawLabelsOnChart(data, chart, meshes, scene);
}

// thanks: https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
function colorHex(str) {
    var ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = str;
    //console.log( str, ctx.fillStyle);
    return ctx.fillStyle;
}

// thanks: https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
function invertColor(hex, bw) {
    if (hex.indexOf("#") === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error("Invalid HEX color.");
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // https://stackoverflow.com/a/3943023/112731
        return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join("0");
    return (zeros + str).slice(-len);
}

// Center point is p1; angle returned in Radians
function angleBetween3Points(p0, p1, p2) {
    var b = Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2),
        a = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2),
        c = Math.pow(p2.x - p0.x, 2) + Math.pow(p2.y - p0.y, 2);

    var radians = Math.acos((a + b - c) / Math.sqrt(4 * a * b));
    console.log(
        "angleBetween3Points",
        radians,
        "degrees",
        (radians * (180 / Math.PI)).toFixed(2)
    );
    return radians;
}

function pieChart(pie3d, data, chart, gui) {
    let oneSlice = function (height, arcFraction, color, label, value) {
        let mat = new StandardMaterial("mat-" + sliceNr);
        mat.alpha = chart.alpha;

        if (chart.alpha < 1) {
            mat.needDepthPrePass = true;
        }

        mat.diffuseColor = color;

        const uniPiece = new Vector4(0, 0, 0.1, 0.1);
        let faceUV = new Array(6).fill(uniPiece);
        faceUV[1] = new Vector4(1, 0, 0, 1);

        // cylinder with arc
        const pie = CreateCylinder("pie", {
            height: Math.abs(height),
            diameter: chart.radius,
            tessellation: chart.segments,
            arc: arcFraction,
            enclose: true,
            faceUV: faceUV,
        });

        let donut: Mesh;
        if (chart.innerRadiusPct > 0) {
            const pieCSG = CSG.FromMesh(pie);

            // inner cylinder
            const donutHoleFraction = chart.innerRadiusPct / 100;
            const diameter = chart.radius * donutHoleFraction + 0.01;

            faceUV[1] = faceUV[0];

            const cyl = CreateCylinder("cyl", {
                height: Math.abs(height),
                diameter: diameter,
                tessellation: chart.segments,
                faceUV: faceUV,
            });

            const cylCSG = CSG.FromMesh(cyl);

            const donutCSG = pieCSG.subtract(cylCSG);
            donut = donutCSG.toMesh("donut-" + sliceNr);

            pie.dispose();
            cyl.dispose();
        } else {
            donut = pie;
        }

        if (chart.showLabel || chart.showValue) {
            let texture = new DynamicTexture("dynamic texture-" + sliceNr, {
                width: 2048 * arcFraction,
                height: 200 * Math.abs(height),
            });

            const fontsize = 32 * pie3d.labelFontFactor;
            const font = ["bold", fontsize + "px", "monospace"].join(" ");
            const blackWhiteVariant = true;
            const textColor =
                chart.labelColor ||
                invertColor(colorHex(color), blackWhiteVariant);
            const textInvertY = true;

            let textOnSlice = "";
            if (chart.showLabel) {
                textOnSlice = label;
            }

            if (chart.showValue) {
                textOnSlice =
                    textOnSlice + (chart.showLabel ? ": " : "") + value;
            }

            const txt_X_distance_from_left_hand_edge = 40;
            const txt_Y_distance_from_the_top =
                60 * (1 + chart.labelFontFactor / 3) +
                chart.labelExtraTopMargin;

            texture.drawText(
                textOnSlice,
                txt_X_distance_from_left_hand_edge,
                txt_Y_distance_from_the_top,
                font,
                textColor,
                color,
                textInvertY
            );
            mat.diffuseTexture = texture;
        }

        donut.material = mat;

        donut.position.y = height / 2 - chart.verticalFactor / 2;

        const halfArcSlice = (2 * Math.PI * arcFraction) / 2;

        donut.rotation.y = rotY;

        if (chart.spaceBetweenSlices) {
            const middleRadius = chart.radius * 0.02; // 2% of diameter = 4% of R

            donut.position.x = Math.cos(rotY + halfArcSlice) * middleRadius;
            donut.position.z = -Math.sin(rotY + halfArcSlice) * middleRadius;
        }


        donut.actionManager = new ActionManager();

        const clickScale = 1 + chart.clickScalePct / 100;

        donut.actionManager.registerAction(
            new InterpolateValueAction(
                ActionManager.OnPickTrigger,
                donut,
                "scaling",
                new Vector3(clickScale, clickScale, clickScale),
                250, // duration
                undefined, // condition
                undefined, // stopOtherAnimations
                function () {
                    // onInterpolationDone: defines a callback raised once the interpolation animation has been done
                    //console.log('click: ', this.value);
                    this.value._x = this.value._x > 1 ? 1 : clickScale;
                    this.value._y = this.value._y > 1 ? 1 : clickScale;
                    this.value._z = this.value._z > 1 ? 1 : clickScale;
                }
            )
        );

        return donut;
    };

    const slices = pie3d.slices;

    let maxVal = 0;
    for (let i = 0; i < slices.length; i++) {
        if (slices[i].value > maxVal) {
            maxVal = slices[i].value;
        }
    }

    let rotY =  Math.PI / 2 - (2 * Math.PI * slices[0].arcPct) / 100 / 2;
    let sliceNr = 0;

    const pieChartSlices: Mesh[] = [];
    for (let i = 0; i < slices.length; i++) {
        let p = slices[i],
            h = (p.value / maxVal) * chart.verticalFactor;

        p.arcPct = p.arcPct / 100;

        let slice = oneSlice(h, p.arcPct, p.color, p.label, p.value);
        if (chart.glow) {
            includeInGlow(slice)
        }
        pieChartSlices.push(slice);

        // increment rotY for the next slice
        rotY = rotY + 2 * Math.PI * p.arcPct;
        sliceNr = sliceNr + 1;
    }

    return pieChartSlices;
}

function createSlices(pie3d) {
    let slices = pie3d.slices.length;
    for (let i = 0; i < slices; i++) {
        if (pie3d.slices[i].arcPct == undefined)
            pie3d.slices[i].arcPct = (1 / slices) * 100;
    }
}

export function drawPieChart2(
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

    let segmentAngleOffset = 0;
    for (let i = 0; i < data.x.values.length; i++) {
        const segmentAngle = 0.1; // (Math.PI * 2) / data.x.values[i];
        const linePoints = [];
        linePoints.push(new Vector3(0, 0, 0));
        arrayConcat(
            getCircleLinePoints(
                chart.radius,
                chart.segments,
                0,
                undefined,
                segmentAngle,
                segmentAngleOffset
            ),
            linePoints
        );
        linePoints.push(new Vector3(0, 0, 0));
        paths.push(linePoints);

        const linePoints2: Vector3[] = [];
        arrayConcat(linePoints, linePoints2);
        for (let j = 0; j < linePoints2.length; j++) {
            linePoints2[j] = linePoints2[j].clone();
            linePoints2[j].y = 2;
        }

        paths.push(linePoints2);

        segmentAngleOffset += segmentAngle;
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
            useColors: false,
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
