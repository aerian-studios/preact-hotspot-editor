export type HotspotShape = RectHotspot | EllipseHotspot | PolygonHotspot;

export type HotspotType = "rect" | "ellipse" | "polygon";

export type Point = [number, number];
export interface RectHotspot {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
}

export interface EllipseHotspot {
    type: "ellipse";
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    text?: string;
}

export interface PolygonHotspot {
    type: "polygon";
    points: Point[];
    text?: string;
}

export const isPolygon = (hotspot: HotspotShape): hotspot is PolygonHotspot =>
    hotspot.type === "polygon";
export const isRect = (hotspot: HotspotShape): hotspot is RectHotspot =>
    hotspot.type === "rect";
export const isEllipse = (hotspot: HotspotShape): hotspot is EllipseHotspot =>
    hotspot.type === "ellipse";
