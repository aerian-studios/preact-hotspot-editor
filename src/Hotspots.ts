import { h, render } from "preact";
import { HotspotEditor } from "./components/HotspotEditor";
import { HotspotEditorProps } from "./components/HotspotEditor/HotspotEditor";
import { HotspotViewer } from "./components/HotspotViewer";
import { HotspotViewerProps } from "./components/HotspotViewer/HotspotViewer";
import { ModalViewer } from "./components/ModalViewer";
import { HotspotShape } from "./types";

export type HotspotEditorConfig = {
    selector: string;
} & HotspotEditorProps;

export type HotspotViewerConfig = {
    selector: string;
    modal?: boolean;
} & HotspotViewerProps;

export default class Hotspots {
    public editor?: Element;

    public viewer?: Element;

    public displayEditor = (editorConfig: HotspotEditorConfig) => {
        const editorTarget =
            this.editor || document.querySelector(editorConfig.selector);

        if (!editorTarget) {
            console.error(
                "Target element not found. Please check config 'selector' value"
            );

            return;
        }
        this.editor = render(
            h(HotspotEditor, editorConfig),
            document.body,
            editorTarget
        );
    };

    public displayViewer = (displayConfig: HotspotViewerConfig) => {
        const displayTarget =
            this.viewer || document.querySelector(displayConfig.selector);

        if (!displayTarget) {
            console.error(
                "Target element not found. Please check config 'selector' value"
            );

            return;
        }
        if (displayConfig.modal) {
            let modalRef: ModalViewer;

            const config = {
                ref: (ref: ModalViewer) => {
                    if (ref) {
                        modalRef = ref;
                    }
                }
            };

            displayConfig.onClick = (hotspot: HotspotShape) => {
                if (!modalRef) {
                    console.log("ref not found");
                }
                modalRef.showModal(hotspot);
            };

            render(h(ModalViewer, config), document.body);
        }
        this.viewer = render(
            h(HotspotViewer, displayConfig),
            document.body,
            displayTarget
        );
    };
}
