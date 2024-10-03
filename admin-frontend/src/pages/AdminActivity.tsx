import { FC, useCallback, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import ActivityType from "../enums/ActivityType";
import EntityType from "../enums/EntityType";
import { fetchActivities } from "../utils/authUtils";
import { Link } from "react-router-dom";
import { ExtendedFilterParams } from "../utils/http";
import Activity from "../models/Activity";
import DataTable from "../components/DataTable";
import { activityQueryKey } from "../constants/queryKeys";
import EntityTypeSvg from "../components/EntityTypeSvg";
import EntityTypeLabel from "../components/EntityTypeLabel";
import { getDateRanges } from "../constants/dropdownOptions";
import {
  ActivityFilterParams,
  defaultFilterParams,
} from "../types/activityFilters";
import AdminActivityDropdown from "../components/AdminActivityDropdown";

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
                    className="p-4 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
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
                                <span className="text-sm font-medium text-blue-600 hover:underline">
                                  {item.entityId}
                                </span>
                              </Link>
                              <div>
                                <Link to={`/admin/${item.adminId}`}>
                                  <span className="text-base font-semibold text-gray-800">
                                    Action Done By Admin ID:{" "}
                                  </span>
                                  <span className="text-sm font-medium text-blue-600 hover:underline">
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
              <AdminActivityDropdown
                params={params}
                updateFilterParams={updateFilterParams}
              />
            ),
          })}
        />
      </div>
    </PageTemplate>
  );
};

export default AdminActivity;
