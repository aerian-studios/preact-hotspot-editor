import { FunctionalComponent, h } from "preact";

import { Overlay } from "../Overlay";
import * as styles from "./HotspotCanvas.scss";

interface Props {
    image: string;
    width: number;
    height: number;
    style?: any;
}

export const HotspotCanvas: FunctionalComponent<Props> = ({
    image,
    width,
    height,
    style
}) => {
    const newStyle = {
        ...style,
        backgroundSize: `${width}px ${height}px`,
        backgroundImage: `url(${image})`
    };
    return (
        <div className={styles.base} style={newStyle}>
            <Overlay width={width} height={height} />
        </div>
    );
};
export default HotspotCanvas;
