// / <reference types="@types/jest" />
import { FunctionalComponent, h } from "preact";

import { render } from "preact-render-to-string";

import { HotspotViewer } from "./index";

describe("HotspotViewer", () =>
    it("renders correctly", () => {
        const tree = renderer.create(<HotspotViewer />).toJSON();

        expect(tree).toMatchSnapshot();
    }));
