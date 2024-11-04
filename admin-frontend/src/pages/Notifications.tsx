import React, { FC, useCallback, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import { fetchNotifications, markAsRead } from "../utils/authUtils";
import DataTable from "../components/DataTable";
import { ExtendedFilterParams, queryClient } from "../utils/http";
import {
  defaultFilterParams,
  NotificationFilterParams,
} from "../types/notificationFilters";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import DropdownFilterGroup from "../components/FilterDropdownMenus";
import DropdownMenu from "../components/DropdownMenu";
import { getDateRanges } from "../constants/dropdownOptions";
import Notification from "../models/Notification";
import SearchBar from "../components/SearchBar";
import RadioGroup from "../components/RadioGroup";
import TimeOption from "../enums/TimeOption";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../types/response";
import ErrorAlert from "../components/ErrorAlert";
import { snakeCaseToReadable, sortNotifications } from "../utils/func";
import { getQueryKey } from "../constants/queryKeys";
const Notifications: React.FC = () => {
  const [params, setParams] =
    useState<ExtendedFilterParams<typeof defaultFilterParams>>(
      defaultFilterParams
    );
  const handleUpdateArgs = useCallback(
    (
      params: ExtendedFilterParams<
        ExtendedFilterParams<NotificationFilterParams>
      >
    ) => {
      setParams(params);
    },
    []
  );
  const fetchFilteringArgs = {
    ...params,
    startDate: getDateRanges(params.timing).start,
    endDate: getDateRanges(params.timing).end,
  };
  return (
    <PageTemplate title="Notifications">
      <DataTable<Notification, NotificationFilterParams>
        queryKey={getQueryKey("notifications")}
        fetchItems={fetchNotifications}
        fetchDataParams={fetchFilteringArgs}
        initialParams={params}
        updateParams={handleUpdateArgs}
        renderTableContent={({
          dataEntries: notifications,
          updateFilterParams,
        }) => ({
          ContentRenderer: () => (
            <ul className="space-y-4">
              {notifications.length &&
                sortNotifications(notifications).map((item) => (
                  <NotificationItem key={item._id} notification={item} />
                ))}
            </ul>
          ),
          dropDownMenus: (
            <DropdownFilterGroup
              searchDropDownMenu={
                <SearchBar
                  onChange={(e) =>
                    updateFilterParams("searchTerm", e.target.value)
                  }
                />
              }
              dropDownMenus={[
                <DropdownMenu
                  label={
                    <div className="flex items-center gap-2 px-3 py-2 border bg-gray-50 text-gray-800">
                      <span className="text-lg font-semibold">Timing</span>
                      <ChevronDoubleDownIcon className="w-5 h-5 text-gray-600" />
                    </div>
                  }
                  content={
                    <div className="flex flex-col p-4 bg-[#171717] text-white">
                      <RadioGroup
                        classes="flex-col border-0"
                        label="Timing"
                        onChange={(e) =>
                          updateFilterParams(
                            "timing",
                            e.target.value as TimeOption
                          )
                        }
                        options={Object.values(TimeOption).map((item) => ({
                          label: item.charAt(0).toUpperCase() + item.slice(1),
                          value: item,
                        }))}
                        name={"timing"}
                        selectedValue={params.timing}
                      />
                    </div>
                  }
                />,
              ]}
            />
          ),
        })}
      />
    </PageTemplate>
  );
};

export default Notifications;

const NotificationItem: FC<{ notification: Notification }> = ({
  notification,
}) => {
  const { isError, error, mutate, isPending } = useMutation<
    null,
    ErrorResponse,
    string[]
  >({
    mutationKey: getQueryKey("notifications"),
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKey("notifications"),
      });
    },
  });

  function handleClickButton() {
    mutate([notification._id]);
  }

  return (
    <>
      <li className="bg-white p-6 border-b border-black flex justify-between w-full">
        <div className="flex-1">
          <h2 className="text-xl uppercase font-bold text-black mb-2 tracking-widest">
            {snakeCaseToReadable(notification.title)}
          </h2>
          <p className="text-black text-base mb-4 leading-7 tracking-wide border-l-2 border-black pl-3 italic">
            {notification.message}
          </p>
          <p className="text-xs text-gray-600 italic">
            {new Date(notification.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            at{" "}
            {new Date(notification.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
        </div>

        <div className="flex flex-col items-end justify-between">
          <div
            className={`w-3 h-3 border-2 rounded-full ${
              notification.isRead
                ? "border-black bg-black"
                : "border-black bg-white"
            }`}
          ></div>
          {notification.isRead === false && (
            <button
              onClick={handleClickButton}
              disabled={isPending}
              className={`mt-6 px-4 py-2 font-semibold border text-xs uppercase tracking-wider transition-all duration-200 ease-in-out
            ${
              isPending
                ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                : "text-black border-black hover:bg-black hover:text-white"
            }
            ${isError ? "border-red-500 text-red-500" : ""}
          `}
            >
              {isPending ? "Marking..." : "Mark as Read"}
            </button>
          )}
        </div>
      </li>
      {isError && <ErrorAlert isTheTitleShown={false} error={error} />}
    </>
  );
};
