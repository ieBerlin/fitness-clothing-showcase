export type Angle = "back" | "front" | "side" | "top" | "bottom";
export const angles = ["back", "front", "side", "top", "bottom"];
interface Image {
  _id: string;
  pathname: string;
  angle?: Angle;
}
export default Image;
