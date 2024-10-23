import { FC } from "react";
import Activity from "../models/Activity";
import ActivityType from "../enums/ActivityType";
import EntityType from "../enums/EntityType";
import { Link } from "react-router-dom";
import EntityTypeSvg from "../components/EntityTypeSvg";
import EntityTypeLabel from "../components/EntityTypeLabel";
const ActivityLogItem: FC<{
  activityItem: Activity;
}> = ({ activityItem }) => {
  return (
    <li className="p-6 border border-gray-300 bg-white transition-transform transform hover:scale-105 hover:shadow-lg">
      <div className="flex items-start gap-4">
        {/* Icon Section */}
        <div className="flex-shrink-0">
          <EntityTypeSvg
            type={activityItem.entityType.toLowerCase() as EntityType}
            classes="w-12 h-12 text-gray-700"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow space-y-2">
          {/* Activity Type */}
          <span className="text-xl uppercase font-bold text-gray-900">
            {activityItem.activityType.split("_").join(" ")}
          </span>

          {/* Entity Type Label */}
          <EntityTypeLabel
            type={activityItem.entityType.toLowerCase() as EntityType}
            classes="text-gray-600"
          />

          {/* Information Section */}
          <div className="mt-2 space-y-2">
            {activityItem.activityType === ActivityType.PRODUCT_DELETED ? (
              <span className="text-sm text-gray-600">
                PRODUCT ID:{" "}
                <span className="font-medium text-blue-600">
                  {activityItem.entityId}
                </span>
              </span>
            ) : (
              <div className="space-y-1">
                <span className="text-base font-semibold text-gray-800">
                  PRODUCT ID:{" "}
                </span>
                <Link
                  to={`/products/${activityItem.entityId}`}
                  className="hover:underline"
                >
                  <span className="text-sm font-medium text-blue-600">
                    {activityItem.entityId}
                  </span>
                </Link>
                <br />
               <div className="flex flex-row gap-0">
               <span className="text-base font-semibold text-gray-800">
                  {" "}
                  Action Done By Admin ID:{" "}
                </span>
                <Link
                  to={`/admin/${activityItem.adminId}`}
                  className="hover:underline"
                >
                  <span className="text-sm font-medium text-blue-600">
                    {activityItem.adminId}
                  </span>
                </Link>
               </div>
              </div>
            )}
            <div className="text-sm text-gray-500">
              {activityItem.entityType.charAt(0).toUpperCase() +
                activityItem.entityType.slice(1)}{" "}
              ID:{" "}
              <span className="font-medium text-gray-800">
                {activityItem.entityId}
              </span>
            </div>
          </div>
        </div>

        {/* Timestamp Section */}
        <div className="text-sm text-gray-400 ml-auto whitespace-nowrap">
          {new Date(activityItem.timestamp).toLocaleString()}
        </div>
      </div>
    </li>
  );
};
export default ActivityLogItem;
