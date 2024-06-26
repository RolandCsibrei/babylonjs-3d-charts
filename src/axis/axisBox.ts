import { CreateGreasedLine } from "@babylonjs/core/Meshes/Builders/greasedLineBuilder";
import { getDz } from "../utils/bounds";
import { ChartData, ChartDataBoundInfo } from "../model";
import { ArcRotateCamera, Mesh, Nullable } from "@babylonjs/core";

export function drawBox(data: ChartData, boundInfo: ChartDataBoundInfo) {
    if (!data.options.box.draw) {
        return;
    }

    // const dx = boundInfo.d.x;
    // const dy = boundInfo.d.y;
    // const dz = getDz(data, boundInfo);

    const dx = data.options.dimensions.x
    const dy = data.options.dimensions.y
    const dz = data.options.dimensions.z

    // draw box
    const boxPoints = [
        [0, 0, 0, dx, 0, 0],
        [0, 0, 0, 0, dy, 0],
        [0, 0, 0, 0, 0, dz],
        [0, 0, dz, 0, dy, dz],
        [0, dy, 0, 0, dy, dz],
        [0, dy, dz, dx, dy, dz],
        [dx, dy, dz, dx, 0, dz],
        [dx, 0, dz, dx, 0, 0],
        [0, 0, dz, dx, 0, dz],
    ];
    const axisBox = CreateGreasedLine(
        "axisBox",
        {
            points: boxPoints,
        },
        {
            width: data.options.box.thickness,
            color: data.options.box.color,
        }
    );

    return axisBox;
}

export function zoomOnAxisBox(axisBox: Nullable<Mesh> | undefined, zoomOnFactor: number, camera: ArcRotateCamera) {
    if (!axisBox) {
        return
    }
    camera.zoomOnFactor = zoomOnFactor
    camera.zoomOn([axisBox]);
}
