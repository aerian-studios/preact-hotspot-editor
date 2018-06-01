import { FunctionalComponent, h } from "preact";

import { Overlay } from "../Overlay";
import * as styles from "./HotspotCanvas.scss";

import { HotspotShape } from "../../types";
import hotspots from "../fixtures/shapes.json";

console.log(hotspots);

interface Props {
    image: string;
    width: number;
    height: number;
    style?: any;

    drawingTool?: "rect" | "polygon" | "ellipse";
    stopEditing?: (hotspots: HotspotShape[]) => void;
}

export const HotspotCanvas: FunctionalComponent<Props> = ({
    image,
    width,
    height,
    style,
    stopEditing,
    drawingTool
}) => {
    const newStyle = {
        ...style,
        backgroundSize: `${width}px ${height}px`,
        backgroundImage: `url(${image})`
    };
    return (
        <div className={styles.base} style={newStyle}>
            <Overlay
                width={width}
                height={height}
                hotspots={hotspots}
                stopEditing={stopEditing}
                drawingTool={drawingTool}
            />
        </div>
    );
};
export default HotspotCanvas;
