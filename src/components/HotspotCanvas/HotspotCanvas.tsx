import { Component, h } from "preact";

import { ColourList } from "../../lib/ColourList";
import {
    EllipseHotspot,
    HotspotShape,
    HotspotType,
    isPolygon,
    Point,
    PolygonHotspot,
    RectHotspot
} from "../../types";
import { Hotspot } from "../Hotspot";
import * as styles from "./HotspotCanvas.scss";

interface Props {
    style?: any;
    width: number;
    height: number;
    hotspots: HotspotShape[];
    drawingTool?: HotspotType;
    stopEditing?: (hotspots: HotspotShape[]) => void;
    image?: string;
}

interface State {
    currentHotspot?: number;
    hotspots: HotspotShape[];
    initialPoint?: Point;
    initialHotspot?: HotspotShape;
    initialVertex?: Point;
    currentVertex?: number;
    mouseMove?: (event: MouseEvent) => void;
    mouseUp?: (event: MouseEvent) => void;
    mouseDown?: (event: MouseEvent) => void;
    onClick?: (event: MouseEvent) => void;
}

export class HotspotCanvas extends Component<Props, State> {
    public svg!: SVGSVGElement;
    public state: State = {
        hotspots: []
    };
    public constructor(props: Props) {
        super(props);
    }

    public getDerivedStateFromProps(
        props: Partial<Props>,
        state: State
    ): State {
        console.log("get derived state", props);
        const { hotspots, drawingTool } = props;
        switch (drawingTool) {
            case "polygon":
                return {
                    ...state,
                    hotspots,
                    onClick: this.addPolygonPoint,
                    mouseDown: undefined,
                    currentHotspot: undefined
                };

            case "rect":
                return {
                    ...state,
                    hotspots,
                    onClick: undefined,
                    mouseDown: this.startRect,
                    currentHotspot: undefined
                };

            case "ellipse":
                return {
                    ...state,
                    hotspots,
                    onClick: undefined,
                    mouseDown: this.startEllipse,
                    currentHotspot: undefined
                };

            default:
                return {
                    ...state,
                    hotspots,
                    onClick: undefined,
                    mouseDown: undefined
                };
        }
    }

    public componentWillReceiveProps(props: Props) {
        const newState = this.getDerivedStateFromProps(props, this.state);
        this.setState(newState);
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
        let { rx, ry } = hotspot;
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

        return { ...hotspot, rx, ry };
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
        ev.preventDefault();
        ev.cancelBubble = true;
        this.setState({
            currentVertex: undefined,
            initialPoint: undefined,
            mouseMove: undefined,
            mouseUp: undefined
        });
        this.restoreClickHandler();
        if (this.props.drawingTool !== "polygon") {
            this.save();
        }
    };

    public save = () => {
        if (this.props.stopEditing) {
            this.props.stopEditing(this.state.hotspots);
        }
    };

    public restoreClickHandler = () => {
        if (this.props.drawingTool === "polygon") {
            window.setTimeout(() => {
                this.setState({ onClick: this.addPolygonPoint });
            }, 500);
        }
    };
    public startMove = (ev: MouseEvent, currentHotspot: number) => {
        ev.preventDefault();
        if (currentHotspot !== this.state.currentHotspot) {
            this.save();
        }
        const initialHotspot: HotspotShape = {
            ...this.state.hotspots[currentHotspot]
        };
        if (isPolygon(initialHotspot)) {
            initialHotspot.points = initialHotspot.points.map(
                ([x, y]): Point => [x, y]
            );
        }
        this.setState({
            onClick: undefined,
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
        ev.cancelBubble = true;
        this.setState({
            onClick: undefined,
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

    public addPolygonPoint = (ev: MouseEvent) => {
        let hotspot: HotspotShape;
        const hotspots = [...this.state.hotspots];
        let currentHotspot = this.state.currentHotspot;
        if (
            typeof currentHotspot === "undefined" ||
            !isPolygon(hotspots[currentHotspot])
        ) {
            hotspot = {
                type: "polygon",
                points: []
            };
            hotspots.push(hotspot);
            currentHotspot = this.state.hotspots.length;
        } else {
            hotspot = hotspots[currentHotspot];
        }
        if (!isPolygon(hotspot)) {
            return;
        }
        const point = this.convertToSVGCoordinates(ev.clientX, ev.clientY);
        hotspot.points = [...hotspot.points, [point.x, point.y]];
        this.setState({
            hotspots,
            currentHotspot
        });
    };

    public startEllipse = (ev: MouseEvent) => {
        ev.preventDefault();
        const { x, y } = this.convertToSVGCoordinates(ev.clientX, ev.clientY);
        const hotspot: EllipseHotspot = {
            type: "ellipse",
            cx: x,
            cy: y,
            rx: 0,
            ry: 0
        };
        const hotspots = [...this.state.hotspots, hotspot];

        this.setState({
            mouseDown: undefined,
            onClick: undefined,
            currentHotspot: hotspots.length - 1,
            currentVertex: 0,
            initialHotspot: hotspot,
            initialPoint: [ev.clientX, ev.clientY],
            mouseMove: this.vertexShouldMove,
            mouseUp: this.doneMove
        });
    };

    public startRect = (ev: MouseEvent) => {
        ev.preventDefault();
        const { x, y } = this.convertToSVGCoordinates(ev.clientX, ev.clientY);
        const hotspot: RectHotspot = {
            type: "rect",
            x,
            y,
            width: 0,
            height: 0
        };
        const hotspots = [...this.state.hotspots, hotspot];

        this.setState({
            mouseDown: undefined,
            onClick: undefined,
            currentHotspot: hotspots.length - 1,
            currentVertex: 0,
            initialHotspot: hotspot,
            initialPoint: [ev.clientX, ev.clientY],
            mouseMove: this.vertexShouldMove,
            mouseUp: this.doneMove
        });
    };

    public onClickLine = (ev: MouseEvent, segment: number) => {
        ev.preventDefault();
        ev.cancelBubble = true;
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
        const { width, height, image } = this.props;
        return (
            <svg
                className={this.props.drawingTool && styles.editing}
                width={width}
                height={height}
                onMouseMove={this.state.mouseMove}
                onMouseUp={this.state.mouseUp}
                onMouseLeave={this.state.mouseUp}
                onMouseDown={this.state.mouseDown}
                onClick={this.state.onClick}
                ref={ref => (this.svg = ref)}
            >
                <image href={image} width={width} height={height} />
                {this.state.hotspots.map((hotspot, index) => (
                    <Hotspot
                        key={index}
                        hotspot={hotspot}
                        colour={ColourList[index % 10]}
                        selected={this.state.currentHotspot === index}
                        onClick={() => this.setState({ currentHotspot: index })}
                        onVertexMouseDown={(ev, vertex) =>
                            this.startMoveVertex(ev, index, vertex)
                        }
                        onMouseDown={ev => this.startMove(ev, index)}
                        onClickLine={this.onClickLine}
                        onClosePolygon={this.save}
                        incomplete={this.props.drawingTool === "polygon"}
                    />
                ))}
            </svg>
        );
    }
}
export default HotspotCanvas;
