import { Component, h } from "preact";

import { isUndefined } from "util";
import { HotspotShape, HotspotType } from "../../types";
import { HotspotCanvas } from "../HotspotCanvas";
import { TextEditor } from "../TextEditor/";
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
    saveHotspots?: (hotspots: HotspotShape[]) => boolean;
    image?: string;
}
interface State {
    selectedIndex?: number;
    selectedHotspot?: number;
    dirty: boolean;
    hotspots: HotspotShape[];
}

const INITIAL_STATE: State = {
    dirty: false,
    hotspots: []
};

const tools: HotspotType[] = ["ellipse", "rect", "polygon"];

export class HotspotEditor extends Component<Props, State> {
    public state = INITIAL_STATE;
    public currentUrl?: string;

    public constructor(props: Props) {
        super(props);
        console.log(props);
        this.setState({ hotspots: props.hotspots, dirty: false });
    }

    public deleteHotspot = () => {
        if (typeof this.state.selectedHotspot === "undefined") {
            return;
        }
        const hotspots = [...this.props.hotspots];
        hotspots.splice(this.state.selectedHotspot, 1);
        this.updateHotspots(hotspots);
    };

    public updateHotspots = (
        hotspots: HotspotShape[],
        selectedHotspot?: number
    ) => {
        this.setState({
            hotspots,
            selectedIndex: undefined,
            selectedHotspot,
            dirty: true
        });
    };

    public saveHotspots = () => {
        if (!this.props.saveHotspots) {
            return;
        }
        const dirty = !this.props.saveHotspots(this.state.hotspots);
        console.log("dirty", dirty);
        this.setState({ dirty });
    };

    public textChanged = (ev: KeyboardEvent) => {
        if (isUndefined(this.state.selectedHotspot)) {
            return;
        }
        const hotspots = [...this.state.hotspots];
        const hotspot = { ...hotspots[this.state.selectedHotspot] };
        hotspot.text = (ev.currentTarget as HTMLTextAreaElement).value;
        hotspots[this.state.selectedHotspot] = hotspot;
        this.setState({ hotspots });
        return "foo";
    };
    public render() {
        const { style, saveHotspots, hotspots, ...props } = this.props;
        return (
            <div className={styles.app} style={style}>
                <div className={styles.sidebar}>
                    <Toolbar
                        labels={["Circle", "Rectangle", "Polygon"]}
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
                    {this.state.dirty && (
                        <ToolButton
                            label="Save"
                            onPress={this.saveHotspots}
                            selected={false}
                        />
                    )}
                </div>
                <HotspotCanvas
                    {...props}
                    hotspots={this.state.hotspots}
                    drawingTool={
                        typeof this.state.selectedIndex !== "undefined"
                            ? tools[this.state.selectedIndex]
                            : undefined
                    }
                    saveHotspots={this.updateHotspots}
                />
                <div>
                    {!isUndefined(this.state.selectedHotspot) && (
                        <TextEditor
                            text={
                                this.state.hotspots[this.state.selectedHotspot]
                                    .text
                            }
                            onChange={this.textChanged}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default HotspotEditor;
