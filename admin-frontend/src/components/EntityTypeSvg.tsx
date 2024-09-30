import { FC } from "react";
import EntityType from "../enums/EntityType";
const EntityTypeSvg: FC<{ type: EntityType; classes: string }> = ({
  type,
  classes,
}) => {
  switch (type) {
    case EntityType.PRODUCT:
      return (
        <svg
          className={`${classes} text-green-600`}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm1 1h12v12H6V6z" />
        </svg>
      );
    case EntityType.SECTION:
      return (
        <svg
          className={`${classes} text-blue-600`}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M4 4h16v4H4V4zm0 6h16v4H4v-4zm0 6h16v4H4v-4z" />
        </svg>
      );
    case EntityType.ADMIN:
      return (
        <svg
          className={`${classes} text-red-600`}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-4.4 0-8 2.6-8 6v2h16v-2c0-3.4-3.6-6-8-6z" />
        </svg>
      );
    default:
      return <div></div>;
  }
};
export default EntityTypeSvg;
