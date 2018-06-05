/// <reference types="@types/jest" />
import { FunctionalComponent, h } from "preact";

import { render } from "preact-render-to-string";

import { ModalViewer } from "./index";

describe("ModalViewer", () =>
    it("renders correctly", () => {
        const tree = renderer.create(<ModalViewer />).toJSON();
        expect(tree).toMatchSnapshot();
    }));
