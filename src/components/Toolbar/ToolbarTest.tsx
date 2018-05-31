/// <reference types="@types/jest" />
import { FunctionalComponent, h } from "preact";

import { render } from "preact-render-to-string";

import { Toolbar } from "./index";

describe("Toolbar", () =>
    it("renders correctly", () => {
        const tree = render(
            <Toolbar
                labels={["Foo", "Bar"]}
                selectedIndex={0}
                onPress={index => {}}
            />
        );
        expect(tree).toMatchSnapshot();
    }));
