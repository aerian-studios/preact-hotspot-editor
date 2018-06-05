export type HotspotShape = RectHotspot | EllipseHotspot | PolygonHotspot;

export type HotspotType = "rect" | "ellipse" | "polygon";

export type Point = [number, number];

interface BaseHotspot {
    type: HotspotType;
    text?: string;
    title?: string;
    link?: string;
    linkText?: string;
}
export interface RectHotspot extends BaseHotspot {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface EllipseHotspot extends BaseHotspot {
    type: "ellipse";
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    text?: string;
}

export interface PolygonHotspot extends BaseHotspot {
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

export const isUndefined = (value: any): value is undefined => {
    return typeof value === "undefined";
};
