import DropdownMenu from "./DropdownMenu";
import { currentDate } from "../utils/date";
import { fetchMyProfile, fetchNotifications } from "../utils/authUtils";
import { useQuery } from "@tanstack/react-query";
import {
  defaultUserPicture,
  ExtendedFilterParams,
  queryClient,
  SERVER_URL,
} from "../utils/http";
import { useCallback, useEffect, useState } from "react";
import DataTable from "./DataTable";
import Notification from "../models/Notification";
import { getQueryKey } from "../constants/queryKeys";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Admin from "../models/Admin";
import { DataResponse, ErrorResponse } from "../types/response";
import { useDispatch } from "react-redux";
import { openModal } from "../features/modal";
import { ModalType } from "../enums/ModalType";
import { NotificationFilterParams } from "../types/notificationFilters";
import { defaultFilterParams } from "../types/notificationFilter";
import { snakeCaseToReadable, sortNotifications } from "../utils/func";
function Navbar() {
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const dispatch = useDispatch();
  const [params, setParams] =
    useState<ExtendedFilterParams<NotificationFilterParams>>(
      defaultFilterParams
    );
  const handleUpdateArgs = useCallback(
    (params: ExtendedFilterParams<NotificationFilterParams>) => {
      setParams(params);
    },
    []
  );
  const {
    isFetching: isFetchingProfile,
    data: profile,
    isError: isErrorProfile,
  } = useQuery<Admin, ErrorResponse>({
    queryKey: ["basic-informations"],
    queryFn: fetchMyProfile,
    staleTime: Infinity,
  });
  function handleLogoutClick() {
    dispatch(
      openModal({
        type: ModalType.LOGOUT,
      })
    );
  }
  useEffect(() => {
    const data = queryClient.getQueryData<DataResponse<Notification>>(
      getQueryKey("notifications", [5])
    );

    if (data && Array.isArray(data.items)) {
      const unreadNotificationsCount = data.items.filter(
        (notification) => !notification.isRead
      ).length;

      if (unreadNotificationsCount > 0) {
        setHasNewNotifications(true);
      } else {
        if (hasNewNotifications) {
          setHasNewNotifications(false);
        }
      }
    }
  }, [
    queryClient.getQueryData<DataResponse<Notification>>(
      getQueryKey("notifications", [5])
    ),
  ]);
  return (
    <nav className="bg-[#171717] px-6 py-2 flex justify-between items-center">
      <div>
        {isFetchingProfile ? (
          <div className="text-white text-xl font-bold">Loading...</div>
        ) : isErrorProfile ? (
          <div className="text-red-500 text-xl font-bold">
            Error loading profile
          </div>
        ) : (
          <h1 className="text-white text-xl font-bold">
            Welcome back,{" "}
            {profile?.fullName
              ? profile.fullName
              : profile?.adminEmail.split("@")[0]}
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
            <div className="relative flex flex-col w-[270px] max-h-[300px] overflow-hidden bg-[#171717] rounded-lg shadow-lg">
              <div className="flex-1 overflow-y-auto p-2">
                <h2 className="font-semibold text-center text-gray-200 mb-4">
                  Recent Notifications
                </h2>
                <DataTable<Notification, NotificationFilterParams>
                  queryKey={getQueryKey("notifications", [5])}
                  canShowMoreResults={false}
                  fetchItems={fetchNotifications}
                  fetchDataParams={params}
                  initialParams={params}
                  updateParams={handleUpdateArgs}
                  renderTableContent={({ dataEntries: notifications }) => ({
                    ContentRenderer: () => (
                      <ul className="space-y-2">
                        {notifications.length ? (
                          sortNotifications(notifications).map(
                            (notification) => (
                              <li
                                key={notification._id}
                                className={`relative p-4 border-b border-gray-700 ${
                                  notification.isRead
                                    ? "bg-[#171717] text-gray-400"
                                    : "bg-gray-700 text-gray-100"
                                }`}
                              >
                                {!notification.isRead && (
                                  <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-pink-500" />
                                )}
                                <h4
                                  className={`font-semibold text-sm line-clamp-1  ${
                                    notification.isRead ? "mt-1" : ""
                                  }`}
                                >
                                  {snakeCaseToReadable(notification.title)}
                                </h4>
                                <p className="text-gray-300  line-clamp-1 text-xs mt-1">
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
                            )
                          )
                        ) : (
                          <li className="p-4 text-gray-500 text-sm text-center">
                            No notifications
                          </li>
                        )}
                      </ul>
                    ),
                  })}
                />
              </div>
              <Link
                to="/notifications"
                className="bg-[#171717] text-gray-200 font-semibold text-center py-2 rounded-b-lg shadow-md hover:bg-[#212121]"
              >
                View All Notifications
              </Link>
            </div>
          }
        />
        <DropdownMenu
          label={
            <img
              src={
                profile?.adminImage
                  ? `${SERVER_URL}/public/uploads/admin/${profile.adminImage}`
                  : defaultUserPicture
              }
              alt="Admin Avatar"
              className="h-8 w-8 rounded-full object-cover bg-gray-600"
            />
          }
          content={
            <div className="flex flex-col bg-[#171717] text-gray-200">
              <Link
                to="/profile"
                className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-white hover:bg-[#212121] transition-colors"
              >
                Your Profile
              </Link>
              <button
                onClick={handleLogoutClick}
                className="px-4 w-full h-full text-start py-2 text-sm font-medium text-gray-200 hover:text-white hover:bg-[#212121] cursor-pointer transition-colors"
              >
                Logout
              </button>
            </div>
          }
        />
      </div>
    </nav>
  );
}
export default Navbar;
