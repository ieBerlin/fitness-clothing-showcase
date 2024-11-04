import { FC } from "react";
import Notification from "../models/Notification";
import { Link } from "react-router-dom";
import ActivityType from "../enums/ActivityType";
import { snakeCaseToReadable } from "../utils/func";

const ActivityLogItem: FC<{ activityItem: Notification }> = ({
  activityItem,
}) => {
  const getIconAndColor = (activityType: string) => {
    switch (activityType) {
      case ActivityType.ADD_PRODUCT:
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-teal-600"
            >
              <path d="M12 2v20m10-10H2" />
            </svg>
          ),
          color: "bg-teal-100",
        };
      case ActivityType.UPDATE_PRODUCT:
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-amber-600"
            >
              <path d="M12 2l8 8-1.5 1.5-6.5-6.5-6.5 6.5L4 10l8-8z" />
            </svg>
          ),
          color: "bg-amber-100",
        };
      case ActivityType.DELETE_PRODUCT:
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-red-600"
            >
              <path d="M3 6h18M4 6l1 14h14l1-14H4z" />
            </svg>
          ),
          color: "bg-red-100",
        };
      case ActivityType.SECTION_ITEMS_UPDATED:
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-blue-600"
            >
              <path d="M4 4h16v16H4z" />
              <path d="M4 4l16 16M4 20L20 4" />
            </svg>
          ),
          color: "bg-blue-100",
        };
      case ActivityType.UPDATE_PRODUCT_IMAGE:
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-purple-600"
            >
              <path d="M14 2h-4a2 2 0 00-2 2v16a2 2 0 002 2h4a2 2 0 002-2V4a2 2 0 00-2-2z" />
            </svg>
          ),
          color: "bg-purple-100",
        };
      case ActivityType.DELETE_PRODUCT_IMAGE:
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-pink-600"
            >
              <path d="M6 18l12-12M6 6l12 12" />
              <path d="M4 4h16v16H4z" />
            </svg>
          ),
          color: "bg-pink-100",
        };
      case ActivityType.REMOVE_PRODUCT_FROM_SECTION:
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-yellow-600"
            >
              <path d="M3 3l18 18M3 21L21 3" />
              <path d="M4 4h16v16H4z" />
            </svg>
          ),
          color: "bg-yellow-100",
        };
      default:
        return { icon: null, color: "bg-gray-200" };
    }
  };

  const { icon, color } = getIconAndColor(activityItem.title);

  return (
    <li
      className={`p-4 border-l-4 transition-transform transform hover:scale-105 hover:shadow-lg ${color} ${
        activityItem.isRead ? "border-gray-300 bg-white" : "border-blue-400"
      } rounded-lg `}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{icon}</div>

        <div className="flex flex-col flex-grow space-y-2">
          <span className="text-lg font-semibold text-gray-800 hover:text-blue-500 transition-colors">
            {snakeCaseToReadable(activityItem.title)}
          </span>

          <div className="mt-1 space-y-1">
            <p className="text-sm text-gray-600">
              {activityItem.message}
            </p>

            <div className="flex flex-row gap-1">
              <span className="text-sm font-semibold text-gray-800">
                Action Done By Admin ID:
              </span>
              <Link
                to={`/admin/${activityItem.senderId}`}
                className="hover:underline hover:text-blue-500 transition-colors"
              >
                <span className="text-sm font-medium text-blue-400">
                  {activityItem.senderId}
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 ml-auto whitespace-nowrap">
          {new Date(activityItem.createdAt).toLocaleString()}
        </div>
      </div>
    </li>
  );
};

export default ActivityLogItem;
