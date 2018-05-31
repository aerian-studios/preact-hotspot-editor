import * as randomColor from "randomcolor";
export const ColourList = new Array(100)
    .fill(0)
    .map(o => randomColor({ alpha: 0.8, format: "rgba" }));
export default ColourList;
