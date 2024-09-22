import React, { FC } from "react";
import PageTemplate from "../components/PageTemplate";
import { Notification } from "../types/notification.types";
import notifications from "../dummy-data/notifications";

const Notifications: React.FC = () => {
  return (
    <PageTemplate title="Notifications">
      <div className="max-w-4xl mx-auto p-4">
        <ul className="space-y-4">
          {notifications.map((item) => (
            <NotificationItem key={item.id} notification={item} />
          ))}
        </ul>
      </div>
    </PageTemplate>
  );
};

export default Notifications;

const NotificationItem: FC<{ notification: Notification }> = ({
  notification,
}) => {
  function handleClickButton() {
    return;
  }
  return (
    <li className="bg-white p-4 rounded-lg shadow-md border border-gray-300 flex flex-row justify-between w-full">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {notification.title}
        </h2>
        <p className="text-gray-600 mt-2">{notification.description}</p>
        <p className="text-sm text-gray-500 mt-1">
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }).format(notification.date)}
        </p>
      </div>

      <div className="flex flex-grow flex-1 flex-col justify-between items-end">
        <div
          className={`w-6 h-6  rounded-full ${
            notification.isRead ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <button
          onClick={handleClickButton}
          className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Make As Read
        </button>
      </div>
    </li>
  );
};
