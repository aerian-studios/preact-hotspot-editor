import { h, FunctionalComponent } from "preact";

import * as styles from "./Hotspot.scss";

interface Props {
    style?: any;
}

export const Hotspot: FunctionalComponent<Props> = ({ children, style }) => (
    <div className={styles.base} style={style}>
        {children}
    </div>
);
export default Hotspot;
