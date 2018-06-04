import { FunctionalComponent, h } from "preact";

import * as styles from "./TextEditor.scss";

interface Props {
    style?: any;
    text: string;
    onChange: (ev: KeyboardEvent) => void;
}

export const TextEditor: FunctionalComponent<Props> = ({
    children,
    style,
    text,
    onChange
}) => (
    <textarea
        className={styles.base}
        style={style}
        onKeyPress={onChange}
        value={text}
    />
);

export default TextEditor;
