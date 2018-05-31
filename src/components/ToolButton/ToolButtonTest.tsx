/// <reference types="@types/jest" />
import { FunctionalComponent, h } from "preact";

import { render } from "preact-render-to-string";

import { ToolButton } from "./index";

describe("ToolButton", () =>
    it("renders correctly", () => {
        const tree = render(
            <ToolButton onPress={() => {}} selected={false} label="Foo" />
        );
        expect(tree).toMatchSnapshot();
    }));
