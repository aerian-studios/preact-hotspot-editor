import { Component, h } from "preact";

import { Toolbar } from "./Toolbar";

import { HotspotShape, HotspotType } from "../types";
import * as styles from "./App.scss";
import sampleHotspots from "./fixtures/shapes.json";
import { HotspotCanvas } from "./HotspotCanvas";
import { ToolButton } from "./ToolButton";

if ((module as any).hot) {
    // tslint:disable-next-line:no-var-requires
    require("preact/debug");
}

interface State {
    selectedIndex?: number;
    hotspots?: HotspotShape[];
    selectedHotspot?: number;
}

const INITIAL_STATE: State = {
    hotspots: []
};

const tools: HotspotType[] = ["ellipse", "rect", "polygon"];

export default class App extends Component {
    public state = INITIAL_STATE;
    public currentUrl?: string;

    public componentDidMount() {
        this.setState({ hotspots: sampleHotspots });
    }

    public deleteHotspot = () => {
        if (typeof this.state.selectedHotspot === "undefined") {
            return;
        }
        const hotspots = [...this.state.hotspots];
        hotspots.splice(this.state.selectedHotspot, 1);
        this.setState({ hotspots, selectedHotspot: undefined });
    };

    public saveHotspots = (hs: HotspotShape[], selectedHotspot: number) => {
        console.log("save", hs);
        this.setState({
            selectedIndex: undefined,
            hotspots: hs,
            selectedHotspot
        });
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
                    {typeof this.state.selectedIndex === "undefined" &&
                        typeof this.state.selectedHotspot !== "undefined" && (
                            <ToolButton
                                label="Delete"
                                onPress={this.deleteHotspot}
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
                    saveHotspots={this.saveHotspots}
                />
            </div>
        );
    }
}
