import { FC } from "react";
import EntityType from "../enums/EntityType";
const entityTypeStyles: Record<EntityType, string> = {
  [EntityType.PRODUCT]: "text-green-600",
  [EntityType.SECTION]: "text-blue-600",
  [EntityType.ADMIN]: "text-red-600",
};

const defaultStyle = "text-gray-500";
const EntityTypeLabel: FC<{ type: EntityType }> = ({ type }) => {
  const styleClass = entityTypeStyles[type] || defaultStyle;
  const label = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="text-lg font-semibold">
      <h2 className="text-base font-semibold text-gray-800 inline">Entity: </h2>
      <span className={`text-sm ${styleClass} font-medium`}>{label}</span>
    </div>
  );
};
export default EntityTypeLabel;
