import React, { FC, useCallback, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import { Notification } from "../types/notification.types";
import { fetchNotifications } from "../utils/authUtils";
import DataTable from "../components/DataTable";
import { ExtendedFilterParams } from "../utils/http";
import {
  defaultFilterParams,
  NotificationFilterParams,
} from "../types/notificationFilters";
import { notificationQueryKey } from "../constants/queryKeys";
import TimeOption from "../enums/TimeOption";
import RadioGroup from "../components/RadioGroup";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import DropdownFilterGroup from "../components/FilterDropdownMenus";
import DropdownMenu from "../components/DropdownMenu";
import { getDateRanges } from "../constants/dropdownOptions";
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
        fetchItems={fetchNotifications}
        fetchDataParams={fetchFilteringArgs}
        initialParams={params}
        updateParams={handleUpdateArgs}
        renderTableContent={({
          dataEntries: notifications,
          updateFilterParams,
        }) => ({
          ContentRenderer: () => (
            <div className="max-w-4xl mx-auto p-4">
              <ul className="space-y-4">
                {notifications.length &&
                  notifications.map((item) => (
                    <NotificationItem key={item._id} notification={item} />
                  ))}
              </ul>
            </div>
          ),
          dropDownMenus: (
            <DropdownFilterGroup
              dropDownMenus={[
                <DropdownMenu
                  label={
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-50 text-gray-800 shadow-sm">
                      <span className="text-lg font-semibold">Timing</span>
                      <ChevronDoubleDownIcon className="w-5 h-5 text-gray-600" />
                    </div>
                  }
                  content={
                    <div className="flex flex-col space-y-2 p-2 text-gray-800">
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
        queryKey={notificationQueryKey}
      />
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
