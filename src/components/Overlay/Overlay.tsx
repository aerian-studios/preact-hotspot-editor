import { Component, h } from "preact";

import { ColourList } from "../../lib/ColourList";
import {
    EllipseHotspot,
    HotspotShape,
    isPolygon,
    Point,
    PolygonHotspot,
    RectHotspot
} from "../../types";
import { Hotspot } from "../Hotspot";
import * as styles from "./Overlay.scss";

interface Props {
    style?: any;
    width: number;
    height: number;
    hotspots: HotspotShape[];
}

type StateName = "start" | "dragging" | "resizing";
type ActionType = "SHAPE_DOWN" | "HANDLE_DOWN" | "MOUSE_UP";

interface State {
    currentHotspot?: number;
    hotspots: HotspotShape[];
    initialPoint?: Point;
    initialHotspot?: HotspotShape;
    initialVertex?: Point;
    currentVertex?: number;
    mouseMove?: (event: MouseEvent) => void;
    mouseUp?: (event: MouseEvent) => void;
}

export class Overlay extends Component<Props, State> {
    public svg!: SVGSVGElement;

    public constructor(props: Props) {
        super(props);
        this.state = {
            hotspots: props.hotspots
        };
    }

    public moveHotspot = (x: number, y: number) => {
        const deltaX = x - this.state.initialPoint![0];
        const deltaY = y - this.state.initialPoint![1];
        const hotspot: HotspotShape = {
            ...this.state.initialHotspot!
        };

        switch (hotspot.type) {
            case "rect":
                hotspot.x += deltaX;
                hotspot.y += deltaY;
                break;

            case "ellipse":
                hotspot.cx += deltaX;
                hotspot.cy += deltaY;
                break;

            case "polygon":
                hotspot.points = hotspot.points.map(
                    ([xx, yy]): Point => [xx + deltaX, yy + deltaY]
                );
        }

        return hotspot;
    };

    public moveVertex = (x: number, y: number): HotspotShape => {
        const deltaX = x - this.state.initialPoint![0];
        const deltaY = y - this.state.initialPoint![1];

        console.log(x, y, this.state.initialPoint, deltaX, deltaY);
        if (!this.state.initialHotspot) {
            return this.state.initialHotspot!;
        }

        const hotspot: HotspotShape = this.state.initialHotspot;
        switch (hotspot.type) {
            case "rect":
                return this.moveRectVertex(deltaX, deltaY, hotspot);

            case "ellipse":
                return this.moveEllipseVertex(deltaX, deltaY, hotspot);

            case "polygon":
                return this.movePolygonVertex(deltaX, deltaY, hotspot);
        }
    };

    public moveRectVertex = (
        deltaX: number,
        deltaY: number,
        hotspot: RectHotspot
    ): RectHotspot => {
        let { x, y, width, height } = hotspot;
        const { currentVertex } = this.state;
        if (typeof currentVertex === "undefined") {
            return hotspot;
        }

        if (currentVertex < 2) {
            // top
            if (deltaY < height) {
                y += deltaY;
                height -= deltaY;
            } else {
                y += height;
                height = deltaY - height;
            }
            // tslint:disable-next-line:no-collapsible-if
        } else {
            // bottom
            if (deltaY > -height) {
                height += deltaY;
            } else {
                y += deltaY + height;
                height = -deltaY - height;
            }
        }

        if (currentVertex === 0 || currentVertex === 3) {
            // Left
            if (deltaX < width) {
                x += deltaX;
                width -= deltaX;
            } else {
                x += width;
                width = deltaX - width;
            }
            // tslint:disable-next-line:no-collapsible-if
        } else {
            // Right
            if (deltaX > -width) {
                width += deltaX;
            } else {
                x += deltaX + width;
                width = -deltaX - width;
            }
        }

        return { ...hotspot, x, y, width, height };
    };

    public moveEllipseVertex = (
        deltaX: number,
        deltaY: number,
        hotspot: EllipseHotspot
    ): EllipseHotspot => {
        let { cx, cy, rx, ry } = hotspot;
        const { currentVertex } = this.state;
        if (typeof currentVertex === "undefined") {
            return hotspot;
        }

        if (currentVertex < 2) {
            // top
            if (deltaY < ry) {
                // cy += deltaY;
                ry -= deltaY;
            } else {
                // cy += ry;
                ry = deltaY - ry;
            }
            // tslint:disable-next-line:no-collapsible-if
        } else {
            // bottom
            if (deltaY > -ry) {
                ry += deltaY;
            } else {
                // cy += deltaY + ry;
                ry = -deltaY - ry;
            }
        }

        if (currentVertex === 0 || currentVertex === 3) {
            // Left
            if (deltaX < rx) {
                // cx += deltaX;
                rx -= deltaX;
            } else {
                // cx += rx;
                rx = deltaX - rx;
            }
            // tslint:disable-next-line:no-collapsible-if
        } else {
            // Right
            if (deltaX > -rx) {
                rx += deltaX;
            } else {
                // cx += deltaX + rx;
                rx = -deltaX - rx;
            }
        }

        return { ...hotspot, cx, cy, rx, ry };
    };

    public movePolygonVertex = (
        deltaX: number,
        deltaY: number,
        hotspot: PolygonHotspot
    ) => {
        const vertex = hotspot.points[this.state.currentVertex!];
        const points = [...hotspot.points];
        points.splice(this.state.currentVertex!, 1, [
            vertex[0] + deltaX,
            vertex[1] + deltaY
        ]);
        return {
            ...hotspot,
            points
        };
    };

    public hotspotShouldMove = (ev: MouseEvent) => {
        if (typeof this.state.currentHotspot === "undefined") {
            return;
        }
        const hotspots = Array.from(this.state.hotspots);
        hotspots.splice(this.state.currentHotspot, 1);
        hotspots.push(this.moveHotspot(ev.clientX, ev.clientY));
        this.setState({
            hotspots,
            currentHotspot: hotspots.length - 1
        });
    };

    public vertexShouldMove = (ev: MouseEvent) => {
        if (
            typeof this.state.currentHotspot === "undefined" ||
            typeof this.state.currentVertex === "undefined"
        ) {
            return;
        }
        const hotspots = Array.from(this.state.hotspots);
        hotspots.splice(
            this.state.currentHotspot,
            1,
            this.moveVertex(ev.clientX, ev.clientY)
        );
        this.setState({
            hotspots
        });
    };

    public doneMove = (ev: MouseEvent) => {
        this.setState({
            currentVertex: undefined,
            initialPoint: undefined,
            mouseMove: undefined,
            mouseUp: undefined
        });
    };
    public startMove = (ev: MouseEvent, currentHotspot: number) => {
        ev.preventDefault();
        const initialHotspot: HotspotShape = {
            ...this.state.hotspots[currentHotspot]
        };
        if (isPolygon(initialHotspot)) {
            initialHotspot.points = initialHotspot.points.map(
                ([x, y]): Point => [x, y]
            );
        }
        this.setState({
            currentHotspot,
            initialHotspot,
            initialPoint: [ev.clientX, ev.clientY],
            mouseMove: this.hotspotShouldMove,
            mouseUp: this.doneMove
        });
    };

    public startMoveVertex = (
        ev: MouseEvent,
        currentHotspot: number,
        currentVertex: number
    ) => {
        console.log("move vertex", currentVertex);
        ev.preventDefault();
        this.setState({
            currentHotspot,
            currentVertex,
            initialHotspot: { ...this.state.hotspots[currentHotspot] },
            initialPoint: [ev.clientX, ev.clientY],
            mouseMove: this.vertexShouldMove,
            mouseUp: this.doneMove
        });
    };

    public convertToSVGCoordinates = (
        x: number,
        y: number
    ): { x: number; y: number } => {
        if (this.svg === null) {
            return { x, y };
        }
        const pt = this.svg.createSVGPoint();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(this.svg.getScreenCTM()!.inverse());
    };

    public onClickLine = (ev: MouseEvent, segment: number) => {
        if (typeof this.state.currentHotspot === "undefined") {
            return;
        }

        const hotspots = Array.from(this.state.hotspots);
        const currentHotspot = hotspots[this.state.currentHotspot];
        if (!isPolygon(currentHotspot)) {
            return;
        }
        const points = [...currentHotspot.points];
        const point = this.convertToSVGCoordinates(ev.clientX, ev.clientY);
        console.log(JSON.stringify(points));
        console.log(
            "inserting",
            [ev.clientX, ev.clientY],
            [point.x, point.y],
            "after",
            points[segment],
            ev
        );
        points.splice(segment + 1, 0, [point.x, point.y]);
        console.log(JSON.stringify(points));

        hotspots.splice(this.state.currentHotspot, 1);
        hotspots.push({ ...currentHotspot, points });
        this.setState({
            hotspots,
            currentHotspot: hotspots.length - 1
        });
    };

    public render() {
        const { width, height } = this.props;
        return (
            <svg
                className={styles.base}
                width={width}
                height={height}
                onMouseMove={this.state.mouseMove}
                onMouseUp={this.state.mouseUp}
                onMouseLeave={this.state.mouseUp}
                ref={ref => (this.svg = ref)}
            >
                {this.state.hotspots.map((hotspot, index) => (
                    <Hotspot
                        key={index}
                        hotspot={hotspot}
                        colour={ColourList[index]}
                        selected={this.state.currentHotspot === index}
                        onClick={() => this.setState({ currentHotspot: index })}
                        onVertexMouseDown={(ev, vertex) =>
                            this.startMoveVertex(ev, index, vertex)
                        }
                        onMouseDown={ev => this.startMove(ev, index)}
                        onClickLine={this.onClickLine}
                    />
                ))}
            </svg>
        );
    }
}
export default Overlay;
