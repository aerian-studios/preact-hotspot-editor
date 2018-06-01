import { Component, h } from "preact";

import { HotspotShape, HotspotType } from "../types";
import * as styles from "./App.scss";
import sampleHotspots from "./fixtures/shapes.json";
import { HotspotCanvas } from "./HotspotCanvas";
import { HotspotEditor } from "./HotspotEditor";
import { ToolButton } from "./ToolButton";

if ((module as any).hot) {
    // tslint:disable-next-line:no-var-requires
    require("preact/debug");
}

interface State {
    hotspots?: HotspotShape[];
}

const INITIAL_STATE: State = {
    hotspots: []
};

export default class App extends Component {
    public state = INITIAL_STATE;

    public componentDidMount() {
        this.setState({ hotspots: sampleHotspots });
    }

    public saveHotspots = (hotspots: HotspotShape[]) => {
        console.log("save", hotspots);
        this.setState({ hotspots });
    };
    public render() {
        return (
            <div id="app" className={styles.app}>
                <HotspotEditor
                    image={"./assets/complications.png"}
                    width={778}
                    height={780}
                    hotspots={this.state.hotspots}
                    saveHotspots={this.saveHotspots}
                />
                <textarea>{JSON.stringify(this.state.hotspots)}</textarea>
            </div>
        );
    }
}
