import { Component, h } from "preact";

import { Toolbar } from "./Toolbar";

import { HotspotShape, HotspotType } from "../types";
import * as styles from "./App.scss";
import hotspots from "./fixtures/shapes.json";
import { HotspotCanvas } from "./HotspotCanvas";
import { ToolButton } from "./ToolButton";

if ((module as any).hot) {
    // tslint:disable-next-line:no-var-requires
    require("preact/debug");
}

interface State {
    selectedIndex?: number;
    hotspots?: HotspotShape[];
}

const INITIAL_STATE: State = {
    hotspots: []
};

const tools: HotspotType[] = ["ellipse", "rect", "polygon"];

export default class App extends Component {
    public state = INITIAL_STATE;
    public currentUrl?: string;

    public componentDidMount() {
        this.setState({ hotspots });
    }

    public saveHotspots = (hs: HotspotShape[]) => {
        console.log("save", hs);
        this.setState({ selectedIndex: undefined, hotspots: hs });
    };
    public render() {
        return (
            <div id="app" className={styles.app}>
                <div className={styles.sidebar}>
                    <Toolbar
                        labels={["Circle", "Square", "Polygon"]}
                        selectedIndex={this.state.selectedIndex}
                        onPress={selectedIndex =>
                            this.setState({ selectedIndex })
                        }
                    />
                    {typeof this.state.selectedIndex === "undefined" && (
                        <ToolButton
                            label="Delete"
                            onPress={() => {}}
                            selected={false}
                        />
                    )}
                </div>
                <HotspotCanvas
                    image={"./assets/complications.png"}
                    width={778}
                    height={780}
                    drawingTool={
                        typeof this.state.selectedIndex !== "undefined"
                            ? tools[this.state.selectedIndex]
                            : undefined
                    }
                    hotspots={this.state.hotspots}
                    stopEditing={this.saveHotspots}
                />
            </div>
        );
    }
}
