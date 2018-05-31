import { FunctionalComponent, h } from "preact";

import * as styles from "./ToolButton.scss";

interface Props {
    style?: any;
    onPress: () => void;
    selected: boolean;
    label: string;
}

export const ToolButton: FunctionalComponent<Props> = ({
    label,
    onPress,
    selected,
    style
}) => (
    <button
        class={selected ? `${styles.base} ${styles.selected}` : styles.base}
        style={style}
        onClick={onPress}
    >
        {label}
    </button>
);
export default ToolButton;
