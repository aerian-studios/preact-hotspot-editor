import { HotspotEditor } from "./components/HotspotEditor/index.ts";
import { h, render } from "preact";

const init = () => {
    const config = window.HotspotEditorData;

    if (!config) {
        console.error("HotspotEditor config not found");

        return;
    }

    const target = document.querySelector(config.selector);

    if (!target) {
        console.error(
            "Target element not found. Please check config 'selector' value"
        );

        return;
    }
    console.log(config);
    render(h(HotspotEditor, config), target);
};

// in development, set up HMR:
if (module.hot) {
    // eslint-disable-next-line
    require("preact/devtools"); // enables React DevTools, be careful on IE
    // module.hot.accept("./components/HotspotEditor/index.ts", () =>
    //     requestAnimationFrame(init)
    // );
}

init();
