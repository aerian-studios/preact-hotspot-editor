import { Component, h } from "preact";

import { HotspotShape } from "../../types";
import * as styles from "./ModalViewer.scss";

interface Props {
    style?: any;
    ref?: (ref: ModalViewer) => void;
}
interface State {
    visible: boolean;
    hotspot?: HotspotShape;
}

const INITIAL_STATE: State = {
    visible: false
};

export class ModalViewer extends Component<Props, State> {
    public state = INITIAL_STATE;

    public showModal = (hotspot: HotspotShape) => {
        console.log("show", hotspot);
        this.setState({ visible: true, hotspot });
    };

    public hide = () => this.setState({ visible: false });

    public render() {
        if (!this.state.visible || !this.state.hotspot) {
            return null;
        }
        const { title, text, link, linkText } = this.state.hotspot;
        return (
            <div class={styles.canvas} style={this.props.style}>
                <div class={styles.overlay} onClick={this.hide} />
                <div class={styles.modal}>
                    {title && <h2>{title}</h2>}
                    {text && <p>{text}</p>}
                    {link && (
                        <p>
                            <a href={link} target="_blank">
                                {linkText || "Learn more"}
                            </a>
                        </p>
                    )}
                    <span class={styles.closebutton} onClick={this.hide}>
                        &times;
                    </span>
                </div>
            </div>
        );
    }
}
export default ModalViewer;
