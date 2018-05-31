import { FunctionalComponent, h } from "preact";

import * as styles from "./Overlay.scss";

interface Props {
    style?: any;
    width: number;
    height: number;
}

export const Overlay: FunctionalComponent<Props> = ({
    children,
    style,
    width,
    height
}) => (
    <div className={styles.base} style={{ ...style, width, height }}>
        {children}
    </div>
);
export default Overlay;
