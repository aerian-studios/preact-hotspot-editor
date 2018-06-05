import { FunctionalComponent, h } from "preact";

import { HotspotShape } from "../../types";
import { Hotspot } from "../Hotspot";
import * as styles from "./HotspotViewer.scss";

interface Props {
    style?: any;
    hotspots: HotspotShape[];
    width: number;
    height: number;
    image: string;
    onClick: (hotspot: HotspotShape) => void;
}

export const HotspotViewer: FunctionalComponent<Props> = ({
    width,
    height,
    image,
    hotspots,
    onClick,
    style
}) => (
    <svg width={width} height={height}>
        <image href={image} width={width} height={height} />
        {hotspots.map((hotspot, index) => (
            <Hotspot
                key={index}
                hotspot={hotspot}
                colour={"rgba(0,0,100,0.1)"}
                onClick={() => onClick(hotspot)}
                noEdit={true}
            />
        ))}
    </svg>
);
export default HotspotViewer;
