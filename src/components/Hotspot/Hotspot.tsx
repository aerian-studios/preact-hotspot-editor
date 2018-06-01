import { h, FunctionalComponent } from "preact";

import * as styles from "./Hotspot.scss";
import { HotspotShape, Point, isPolygon, PolygonHotspot } from "../../types";
import hotspots from "../fixtures/shapes.json";

interface Props {
    hotspot: HotspotShape;
    colour?: string;
    selected?: boolean;
    onMouseDown: MouseHandler;
    onClick: MouseHandler;
    onVertexMouseDown: CornerHandler;
    onClickLine: (ev: MouseEvent, segment: number) => void;
    incomplete?: boolean;
    onClosePolygon?: MouseHandler;
}

type MouseHandler = (ev: MouseEvent) => void;

type CornerHandler = (ev: MouseEvent, index: number) => void;

const makeHandle = (
    point: Point,
    index: number,
    onVertexMouseDown: CornerHandler,
    highlight = false,
    onClosePolygon?: MouseHandler
) => {
    return (
        <rect
            className={styles.handle}
            x={point[0] - 5}
            y={point[1] - 5}
            width={10}
            height={10}
            stroke-width={highlight ? 4 : 2}
            stroke="black"
            fill="white"
            onClick={onClosePolygon}
            onMouseDown={ev => onVertexMouseDown(ev, index)}
        />
    );
};

const getHandles = (
    hotspot: HotspotShape,
    onHandleMouseDown: CornerHandler,
    incomplete = false,
    onClosePolygon?: MouseHandler
) => {
    switch (hotspot.type) {
        case "ellipse":
            return [
                makeHandle(
                    [hotspot.cx - hotspot.rx, hotspot.cy - hotspot.ry],
                    0,
                    onHandleMouseDown
                ),
                makeHandle(
                    [hotspot.cx + hotspot.rx, hotspot.cy - hotspot.ry],
                    1,
                    onHandleMouseDown
                ),
                makeHandle(
                    [hotspot.cx + hotspot.rx, hotspot.cy + hotspot.ry],
                    2,
                    onHandleMouseDown
                ),
                makeHandle(
                    [hotspot.cx - hotspot.rx, hotspot.cy + hotspot.ry],
                    3,
                    onHandleMouseDown
                )
            ];
        case "polygon":
            return hotspot.points.map((point, index) =>
                makeHandle(
                    point,
                    index,
                    onHandleMouseDown,
                    incomplete && index === hotspot.points.length - 1,
                    incomplete && index === 0 ? onClosePolygon : undefined
                )
            );

        case "rect":
            return [
                makeHandle([hotspot.x, hotspot.y], 0, onHandleMouseDown),
                makeHandle(
                    [hotspot.x + hotspot.width, hotspot.y],
                    1,
                    onHandleMouseDown
                ),
                makeHandle(
                    [hotspot.x + hotspot.width, hotspot.y + hotspot.height],
                    2,
                    onHandleMouseDown
                ),
                makeHandle(
                    [hotspot.x, hotspot.y + hotspot.height],
                    3,
                    onHandleMouseDown
                )
            ];
    }
};

const getLine = (
    hotspot: PolygonHotspot,
    onClickLine: (ev: MouseEvent, segment: number) => void,
    incomplete = false
) =>
    hotspot.points.map((point, index) => {
        if (incomplete && index === hotspot.points.length - 1) {
            return;
        }
        const next =
            index === hotspot.points.length - 1
                ? hotspot.points[0]
                : hotspot.points[index + 1];
        return [
            <line
                x1={point[0]}
                y1={point[1]}
                x2={next[0]}
                y2={next[1]}
                stroke-width={2}
                stroke="black"
                fill="none"
            />,
            <line
                className={styles.line}
                x1={point[0]}
                y1={point[1]}
                x2={next[0]}
                y2={next[1]}
                onClick={ev => onClickLine(ev, index)}
                stroke-width={6}
                stroke="transparent"
                fill="none"
            />
        ];
    });

const getShape = (
    hotspot: HotspotShape,
    colour: string,
    onMouseDown: MouseHandler,
    onClick: MouseHandler,
    selected: boolean
) => {
    switch (hotspot.type) {
        case "ellipse":
            return (
                <ellipse
                    class={styles.shape}
                    {...hotspot}
                    fill={colour}
                    onMouseDown={onMouseDown}
                    onClick={onClick}
                    draggable={false}
                    stroke-width={selected ? 2 : 0}
                    stroke={selected ? "black" : "none"}
                />
            );

        case "polygon":
            return (
                <polygon
                    class={styles.shape}
                    points={hotspot.points.join()}
                    fill={colour}
                    onMouseDown={onMouseDown}
                    onClick={onClick}
                    draggable={false}
                />
            );

        case "rect":
            return (
                <rect
                    {...hotspot}
                    class={styles.shape}
                    fill={colour}
                    onMouseDown={onMouseDown}
                    onClick={onClick}
                    draggable={false}
                    stroke-width={selected ? 2 : 0}
                    stroke={selected ? "black" : "none"}
                />
            );
    }
};

export const Hotspot: FunctionalComponent<Props> = ({
    hotspot,
    colour = "rgba(0,0,0,0.5)",
    selected,
    onMouseDown,
    onClick,
    onVertexMouseDown,
    onClickLine,
    incomplete = false,
    onClosePolygon
}) => {
    return (
        <svg draggable={false}>
            {[
                getShape(hotspot, colour, onMouseDown, onClick, !!selected),
                selected &&
                    isPolygon(hotspot) &&
                    getLine(hotspot, onClickLine, incomplete),
                selected &&
                    getHandles(
                        hotspot,
                        onVertexMouseDown,
                        incomplete,
                        onClosePolygon
                    )
            ]}
        </svg>
    );
};
export default Hotspot;
