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
    linkText?: HTMLInputElement,
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
    if (linkText) {
        hs.linkText = linkText.value;
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
            onInput={ev =>
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
            onInput={ev =>
                textChanged(
                    hotspot,
                    onChange,
                    undefined,
                    ev.currentTarget as HTMLTextAreaElement
                )
            }
            value={hotspot.text}
        />
        <input
            type="text"
            placeholder="Link text"
            onInput={ev =>
                textChanged(
                    hotspot,
                    onChange,
                    undefined,
                    undefined,
                    ev.currentTarget as HTMLInputElement
                )
            }
            value={hotspot.linkText}
        />
        <input
            type="text"
            placeholder="Link URL"
            onInput={ev =>
                textChanged(
                    hotspot,
                    onChange,
                    undefined,
                    undefined,
                    undefined,
                    ev.currentTarget as HTMLInputElement
                )
            }
            value={hotspot.link}
        />
    </div>
);

export default TextEditor;
