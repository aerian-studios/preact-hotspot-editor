import { Component, h } from "preact";

import { HotspotCanvas } from "./HotspotCanvas";
import { Toolbar } from "./Toolbar";

import { HotspotShape, HotspotType } from "../types";
import * as styles from "./App.scss";

if ((module as any).hot) {
    // tslint:disable-next-line:no-var-requires
    require("preact/debug");
}

interface State {
    selectedIndex?: number;
}

const INITIAL_STATE: State = {};

const tools: HotspotType[] = ["ellipse", "rect", "polygon"];

export default class App extends Component {
    public state = INITIAL_STATE;
    public currentUrl?: string;

    public saveHotspots = (hotspots: HotspotShape[]) => {
        console.log("save", hotspots);
        this.setState({ selectedIndex: undefined });
    };
    public render() {
        return (
            <div id="app" className={styles.app}>
                <Toolbar
                    labels={["Circle", "Square", "Polygon"]}
                    selectedIndex={this.state.selectedIndex}
                    onPress={selectedIndex => this.setState({ selectedIndex })}
                />
                <HotspotCanvas
                    image={"./assets/complications.png"}
                    width={778}
                    height={780}
                    drawingTool={
                        typeof this.state.selectedIndex !== "undefined"
                            ? tools[this.state.selectedIndex]
                            : undefined
                    }
                    stopEditing={this.saveHotspots}
                />
            </div>
        );
    }
}
