import DropdownMenu from "./DropdownMenu";
import DropdownItem from "./DropdownItem";
import { currentDate } from "../utils/date";
import { fetchMyProfile, fetchNotifications } from "../utils/authUtils";
import { useQuery } from "@tanstack/react-query";
import { ExtendedFilterParams } from "../utils/http";
import { useCallback, useState } from "react";
import DataTable from "./DataTable";
import Notification from "../models/Notification";
import { notificationQueryKey } from "../constants/queryKeys";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const hasNewNotifications = false;

function Navbar() {
  const [params, setParams] = useState<ExtendedFilterParams<null>>(null);
  const handleUpdateArgs = useCallback((params: ExtendedFilterParams<null>) => {
    setParams(params);
  }, []);
  const {
    isFetching: isFetchingProfile,
    data: profile,
    isError: isErrorProfile,
  } = useQuery({
    queryKey: ["basic-informations"],
    queryFn: fetchMyProfile,
    staleTime: Infinity,
  });
  return (
    <nav className="bg-gray-700 px-6 py-2 flex justify-between items-center">
      <div>
        {isFetchingProfile ? (
          <div className="text-white text-xl font-bold">Loading...</div>
        ) : isErrorProfile ? (
          <div className="text-red-500 text-xl font-bold">
            Error loading profile
          </div>
        ) : (
          <h1 className="text-white text-xl font-bold">
            Welcome back, {profile?.adminEmail.split("@")[0]}
          </h1>
        )}
        <h2 className="text-gray-300 text-md">{currentDate}</h2>
      </div>
      <div className="relative flex flex-row items-center gap-6 justify-center">
        <DropdownMenu
          label={
            <div className="relative inline-flex w-fit">
              {hasNewNotifications && (
                <div className="absolute bottom-auto left-auto right-0 top-0 z-10 inline-block -translate-y-1/2 translate-x-2/4 rounded-full bg-pink-700 p-1.5 text-xs"></div>
              )}

              <BellIcon className="h-[28px] w-[28px]" />
            </div>
          }
          content={
            <div className="relative flex flex-col w-[270px] max-h-[300px] overflow-hidden bg-gray-900 rounded-lg shadow-lg">
              <div className="flex-1 overflow-y-auto p-2">
                <h2 className="font-semibold text-center text-gray-200 mb-4">
                  Recent Notifications
                </h2>
                <DataTable<Notification, null>
                  canShowMoreResults={false}
                  fetchItems={fetchNotifications}
                  fetchDataParams={params}
                  initialParams={params}
                  updateParams={handleUpdateArgs}
                  renderTableContent={({ dataEntries: notifications }) => ({
                    ContentRenderer: () => (
                      <ul className="space-y-2">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <li
                              key={notification._id}
                              className={`relative p-4 border-b border-gray-700 ${
                                notification.isRead
                                  ? "bg-gray-800 text-gray-400"
                                  : "bg-gray-700 text-gray-100"
                              }`}
                            >
                              {!notification.isRead && (
                                <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-pink-500" />
                              )}
                              <h4
                                className={`font-semibold text-sm ${
                                  notification.isRead ? "mt-1" : ""
                                }`}
                              >
                                {notification.title}
                              </h4>
                              <p className="text-gray-300 text-xs mt-1">
                                {notification.message}
                              </p>
                              <div className="flex justify-end mt-2">
                                <span className="text-gray-500 text-xs">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="p-4 text-gray-500 text-sm text-center">
                            No notifications
                          </li>
                        )}
                      </ul>
                    ),
                    // dropDownMenus: (
                    //   <AdminActivityDropdown
                    //     params={params}
                    //     updateFilterParams={updateFilterParams}
                    //   />
                    // ),
                  })}
                  queryKey={notificationQueryKey}
                />
              </div>
              <Link
                to="/notifications"
                className="bg-gray-800 text-gray-200 font-semibold text-center py-2 rounded-b-lg shadow-md hover:bg-gray-700"
              >
                View All Notifications
              </Link>
            </div>
          }
        />

        <DropdownMenu
          label={
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/220px-Joe_Biden_presidential_portrait.jpg"
              alt="Admin Avatar"
              className="h-8 w-8 rounded-full object-cover bg-gray-600"
            />
          }
          content={
            <div className="bg-gray-800 text-gray-200 rounded-lg shadow-lg">
              <DropdownItem label="Your Profile" href="/profile" />
              <DropdownItem label="Settings" href="/settings" />
              <DropdownItem label="Logout" href="/logout" />
            </div>
          }
        />
      </div>
    </nav>
  );
}
export default Navbar;
