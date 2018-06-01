import { Component, h } from "preact";

import { HotspotShape, HotspotType } from "../../types";
import { HotspotCanvas } from "../HotspotCanvas";
import { Toolbar } from "../Toolbar";
import { ToolButton } from "../ToolButton";
import * as styles from "./HotspotEditor.scss";

if ((module as any).hot) {
    // tslint:disable-next-line:no-var-requires
    require("preact/debug");
}
interface Props {
    style?: any;
    width: number;
    height: number;
    hotspots: HotspotShape[];
    saveHotspots?: (hotspots: HotspotShape[], selectedHotspot?: number) => void;
    image?: string;
}
interface State {
    selectedIndex?: number;
    selectedHotspot?: number;
}

const INITIAL_STATE: State = {};

const tools: HotspotType[] = ["ellipse", "rect", "polygon"];

export class HotspotEditor extends Component<Props, State> {
    public state = INITIAL_STATE;
    public currentUrl?: string;

    public deleteHotspot = () => {
        if (typeof this.state.selectedHotspot === "undefined") {
            return;
        }
        const hotspots = [...this.props.hotspots];
        hotspots.splice(this.state.selectedHotspot, 1);
        this.saveHotspots(hotspots);
    };

    public saveHotspots = (hs: HotspotShape[], selectedHotspot?: number) => {
        this.setState({
            selectedIndex: undefined,
            selectedHotspot
        });
        this.props.saveHotspots(hs, selectedHotspot);
    };
    public render() {
        const { style, saveHotspots, ...props } = this.props;
        return (
            <div className={styles.app} style={style}>
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
                    {...props}
                    drawingTool={
                        typeof this.state.selectedIndex !== "undefined"
                            ? tools[this.state.selectedIndex]
                            : undefined
                    }
                    saveHotspots={this.saveHotspots}
                />
            </div>
        );
    }
}

export default HotspotEditor;
