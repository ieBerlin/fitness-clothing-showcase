import { FC, useCallback, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import ActivityType from "../enums/ActivityType";
import EntityType from "../enums/EntityType";
import { fetchActivities } from "../utils/authUtils";
import { Link } from "react-router-dom";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import DropdownMenu from "../components/DropdownMenu";
import { queryClient, ExtendedFilterParams } from '../utils/http';
import RadioGroup from "../components/RadioGroup";
import FilterMenu from "../components/FilterMenu";
import Activity from "../models/Activity";
import DataTable from "../components/DataTable";
import DropdownFilterGroup from "../components/FilterDropdownMenus";
const options = [10, 20, 50, 100];
const activityQueryKey = ["activities"];
enum TimeOption {
  ALL_THE_TIME = "all_the_time",
  LAST_7_DAYS = "last_7_days",
  LAST_30_DAYS = "last_30_days",
  THIS_YEAR = "this_year",
}
const ActivityOptions = Object.values(ActivityType);
const EntityOptions = Object.values(EntityType);
const getDateRanges = (time: TimeOption) => {
  const now = new Date();
  const startOfDay = (date: Date) => new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = (date: Date) => new Date(date.setHours(23, 59, 59, 999));
  switch (time) {
    case TimeOption.ALL_THE_TIME:
      return {
        start: new Date(0),
        end: endOfDay(now),
      };
    case TimeOption.THIS_YEAR:
      return {
        start: startOfDay(new Date(now.getFullYear(), 0, 1)),
        end: endOfDay(new Date(now.getFullYear(), 11, 31)),
      };
    case TimeOption.LAST_30_DAYS:
      return {
        start: startOfDay(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)),
        end: endOfDay(now),
      };
    case TimeOption.LAST_7_DAYS:
      return {
        start: startOfDay(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
        end: endOfDay(now),
      };
  }
};
export type ActivityFilterParams = {
  timing: TimeOption;
  adminId?: string;
  activityType?: ActivityType[];
  entityType?: EntityType[];
  startDate: Date;
  endDate: Date;
};
const defaultFilterParams: ExtendedFilterParams<ActivityFilterParams> = {
  currentPage: 1,
  searchTerm: "",
  itemLimit: 10,
  timing: TimeOption.ALL_THE_TIME,
  activityType: ActivityOptions as ActivityType[],
  entityType: EntityOptions as EntityType[],
  startDate: getDateRanges(TimeOption.ALL_THE_TIME).start,
  endDate: getDateRanges(TimeOption.ALL_THE_TIME).end,
};

const AdminActivity: FC = () => {
  const [params, setParams] =
    useState<ExtendedFilterParams<ExtendedFilterParams<ActivityFilterParams>>>(
      defaultFilterParams
    );

  const handleUpdateArgs = useCallback(
    (params: ExtendedFilterParams<ActivityFilterParams>) => {
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
    <PageTemplate title="Admin Activities">
      <div className="mb-6 flex space-x-4">
        <DataTable<Activity, ActivityFilterParams>
          key="admin-activity-data-table"
          updateParams={handleUpdateArgs}
          fetchDataParams={fetchFilteringArgs}
          initialParams={params}
          queryKey={activityQueryKey}
          fetchItems={fetchActivities}
          renderTableContent={({ updateFilterParams, dataEntries: items }) => ({
            ContentRenderer: () => (
              <ul className="space-y-6">
                {items.map((item, index) => (
                  <li
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start">
                      <div className="mr-4">
                        <EntityTypeSvg
                          type={item.entityType.toLowerCase() as EntityType}
                          classes="w-12 h-12 text-gray-800"
                        />
                      </div>
                      <div className="flex flex-col flex-grow">
                        <span className="text-lg font-semibold text-blue-700 mb-1">
                          {item.activityType
                            .split("_")
                            .map(
                              (part) =>
                                part.charAt(0).toUpperCase() + part.slice(1)
                            )
                            .join(" ")}
                        </span>
                        <EntityTypeLabel
                          type={item.entityType.toLowerCase() as EntityType}
                        />
                        <div className="mt-2 space-y-1">
                          {item.activityType ===
                          ActivityType.PRODUCT_DELETED ? (
                            <span className="text-sm text-gray-700">
                              PRODUCT ID:{" "}
                              <span className="font-medium text-blue-600">
                                {item.entityId}
                              </span>
                            </span>
                          ) : (
                            <div className="space-y-1">
                              <Link to={`/products/${item.entityId}`}>
                                <span className="text-base font-semibold text-gray-800">
                                  PRODUCT ID:{" "}
                                </span>
                                <span className="text-sm text-blue-600 hover:underline">
                                  {item.entityId}
                                </span>
                              </Link>
                              <div>
                                <Link to={`/admin/${item.adminId}`}>
                                  <span className="text-base font-semibold text-gray-800">
                                    Action Done By Admin ID:{" "}
                                  </span>
                                  <span className="text-sm text-blue-600 hover:underline">
                                    {item.adminId}
                                  </span>
                                </Link>
                              </div>
                            </div>
                          )}
                          <div className="text-sm text-gray-500">
                            {item.entityType.charAt(0).toUpperCase() +
                              item.entityType.slice(1)}{" "}
                            ID:{" "}
                            <span className="font-medium text-gray-800">
                              {item.entityId}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 ml-auto">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ),
            dropDownMenus: (
              <DropdownFilterGroup
                dropDownMenus={[
                  <DropdownMenu
                    label={
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-50 text-gray-800 shadow-sm">
                        <span className="text-lg font-semibold">Showing</span>
                        <ChevronDoubleDownIcon className="w-4 h-4 text-gray-600" />
                      </div>
                    }
                    content={
                      <ul className="space-y-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        {options.map((option) => (
                          <li
                            key={option}
                            className="cursor-pointer hover:bg-gray-100 active:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out"
                            onClick={() =>
                              updateFilterParams("itemLimit", option)
                            }
                          >
                            <span className="text-gray-800 font-medium">
                              {option}
                            </span>
                          </li>
                        ))}
                      </ul>
                    }
                  />,
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
                          label="Price"
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
                  <DropdownMenu
                    closeOnContentClick={false}
                    onSubmit={() => {
                      queryClient.invalidateQueries({
                        queryKey: ["activities"],
                      });
                    }}
                    label={
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-50 text-gray-800 shadow-sm">
                        <span className="text-lg font-semibold">
                          Activity Type
                        </span>
                        <ChevronDoubleDownIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    }
                    content={
                      <FilterMenu
                        label="Activity Type"
                        name="activity-type"
                        options={Object.values(ActivityType).map((item) => ({
                          label: item.charAt(0).toUpperCase() + item.slice(1),
                          value: item,
                        }))}
                        onCheck={(updatedValues) =>
                          updateFilterParams(
                            "activityType",
                            updatedValues as ActivityType[]
                          )
                        }
                        defaultCheckedValues={params.activityType || []}
                      />
                    }
                  />,
                  <DropdownMenu
                    closeOnContentClick={false}
                    onSubmit={() => {
                      queryClient.invalidateQueries({
                        queryKey: ["activities"],
                      });
                    }}
                    label={
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-50 text-gray-800 shadow-sm">
                        <span className="text-lg font-semibold">
                          Entity Type
                        </span>
                        <ChevronDoubleDownIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    }
                    content={
                      <FilterMenu
                        label="Entity Type"
                        name="Entity-type"
                        options={Object.values(EntityType).map((item) => ({
                          label: item.charAt(0).toUpperCase() + item.slice(1),
                          value: item,
                        }))}
                        onCheck={(updatedValues) =>
                          updateFilterParams(
                            "entityType",
                            updatedValues as EntityType[]
                          )
                        }
                        defaultCheckedValues={params.entityType || []}
                      />
                    }
                  />,
                ]}
              />
            ),
          })}
        />
      </div>
    </PageTemplate>
  );
};

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

export default AdminActivity;
