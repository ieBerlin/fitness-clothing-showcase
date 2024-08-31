import Color from "../enums/Color";
import Size from "./Size";

interface ColorOption {
  name: Color;
  availableSizes: Size[];
}
export default ColorOption;
