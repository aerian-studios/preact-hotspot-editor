import { HotspotEditor } from "./components/HotspotEditor/index.ts";
import { HotspotViewer } from "./components/HotspotViewer/index.ts";
import { ModalViewer } from "./components/ModalViewer/index.ts";
import { h, render } from "preact";

const init = () => {
    const editorConfig = window.HotspotEditorData;

    if (editorConfig) {
        const editorTarget = document.querySelector(editorConfig.selector);

        if (!editorTarget) {
            console.error(
                "Target element not found. Please check config 'selector' value"
            );

            return;
        }
        render(h(HotspotEditor, editorConfig), document.body, editorTarget);
    }

    const displayConfig = window.HotspotViewerData;

    if (displayConfig) {
        const displayTarget = document.querySelector(displayConfig.selector);

        if (!displayTarget) {
            console.error(
                "Target element not found. Please check config 'selector' value"
            );

            return;
        }
        if (displayConfig.modal) {
            let modalRef;

            const config = {
                ref: ref => {
                    if (ref) {
                        modalRef = ref;
                    }
                }
            };

            displayConfig.onClick = hotspot => {
                if (!modalRef) {
                    console.log("ref not found");
                }
                modalRef.showModal(hotspot);
            };

            render(h(ModalViewer, config), document.body);
        }
        render(h(HotspotViewer, displayConfig), document.body, displayTarget);
    }
};

// in development, set up HMR:
if (module.hot) {
    // eslint-disable-next-line
    require("preact/devtools"); // enables React DevTools, be careful on IE
}

init();
