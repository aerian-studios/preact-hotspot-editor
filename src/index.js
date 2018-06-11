import Hotspots from "./Hotspots.ts";

const HS = new Hotspots();

const init = () => {
    const editorConfig = window.HotspotEditorData;

    if (editorConfig) {
        HS.displayEditor(editorConfig);
    }

    const viewerConfig = window.HotspotViewerData;

    if (viewerConfig) {
        HS.displayViewer(viewerConfig);
    }
};

window.Hotspots = HS;

init();
