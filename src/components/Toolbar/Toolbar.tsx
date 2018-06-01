import { FunctionalComponent, h } from "preact";

import { ToolButton } from "../ToolButton";
import * as styles from "./Toolbar.scss";

interface Props {
    style?: any;
    labels: string[];
    selectedIndex?: number;

    onPress: (index: number) => void;
}

export const Toolbar: FunctionalComponent<Props> = ({
    style,
    labels,
    selectedIndex,
    onPress
}) => (
    <div className={styles.base} style={style}>
        {labels.map((label, index) => (
            <ToolButton
                key={label}
                label={label}
                onPress={() => onPress(index)}
                selected={index === selectedIndex}
            />
        ))}
    </div>
);
export default Toolbar;
