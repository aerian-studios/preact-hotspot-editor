import { FunctionalComponent, h } from "preact";

import { HotspotShape } from "../../types";
import * as styles from "./TextEditor.scss";

interface Props {
    style?: any;
    hotspot: HotspotShape;
    onChange: (ev: HotspotShape) => void;
}

const textChanged = (
    hotspot: HotspotShape,
    onChange: (ev: HotspotShape) => void,
    title?: HTMLInputElement,
    text?: HTMLTextAreaElement,
    link?: HTMLInputElement
) => {
    const hs = { ...hotspot };
    if (title) {
        hs.title = title.value;
    }
    if (text) {
        hs.text = text.value;
    }
    if (link) {
        hs.link = link.value;
    }
    onChange(hs);
};

export const TextEditor: FunctionalComponent<Props> = ({
    children,
    style,
    hotspot,
    onChange
}) => (
    <div className={styles.base} style={style}>
        <input
            type="text"
            placeholder="Title"
            onKeyPress={ev =>
                textChanged(
                    hotspot,
                    onChange,
                    ev.currentTarget as HTMLInputElement
                )
            }
            value={hotspot.title}
        />
        <textarea
            placeholder="Description"
            onKeyPress={ev =>
                textChanged(
                    hotspot,
                    onChange,
                    null,
                    ev.currentTarget as HTMLTextAreaElement
                )
            }
            value={hotspot.text}
        />
        <input
            type="text"
            placeholder="Link"
            onKeyPress={ev =>
                textChanged(
                    hotspot,
                    onChange,
                    null,
                    null,
                    ev.currentTarget as HTMLInputElement
                )
            }
            value={hotspot.link}
        />
    </div>
);

export default TextEditor;
