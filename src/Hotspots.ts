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
    public displayEditor = (editorConfig: HotspotEditorConfig) => {
        const editorTarget = document.querySelector(editorConfig.selector);

        if (!editorTarget) {
            console.error(
                "Target element not found. Please check config 'selector' value"
            );

            return;
        }
        editorTarget.innerHTML = "";
        render(h(HotspotEditor, editorConfig), editorTarget);
    };

    public displayViewer = (displayConfig: HotspotViewerConfig) => {
        const displayTarget = document.querySelector(displayConfig.selector);

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
        displayTarget.innerHTML = "";
        render(h(HotspotViewer, displayConfig), displayTarget);
    };
}
