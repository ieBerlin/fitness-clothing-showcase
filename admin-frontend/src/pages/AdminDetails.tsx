import React, { useCallback, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { activityQueryKey, adminQueryKey } from "../constants/queryKeys";
import { fetchAdmin, fetchActivities } from "../utils/authUtils";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { isString } from "lodash";
import { ErrorResponse } from "../types/response";
import Admin from "../models/Admin";
import Activity from "../models/Activity";
import DataTable from "../components/DataTable";
import { ExtendedFilterParams, SERVER_URL } from "../utils/http";

import ActivityType from "../enums/ActivityType";
import EntityType from "../enums/EntityType";
import { Link } from "react-router-dom";
import defaultUserPicture from "/default-profile.jpg";
import TimeOption from "../enums/TimeOption";
import {
  ActivityOptions,
  EntityOptions,
  getDateRanges,
} from "../constants/dropdownOptions";
import { ActivityFilterParams } from "../types/activityFilters";
import EntityTypeSvg from "../components/EntityTypeSvg";
import EntityTypeLabel from "../components/EntityTypeLabel";
import AdminActivityDropdown from "../components/AdminActivityDropdown";


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

const AdminDetails: React.FC = () => {
  const [params, setParams] =
    useState<ExtendedFilterParams<typeof defaultFilterParams>>(
      defaultFilterParams
    );
  const handleUpdateArgs = useCallback(
    (params: ExtendedFilterParams<ActivityFilterParams>) => {
      setParams(params);
    },
    []
  );
  const { adminId } = useParams();

  const {
    data: adminData,
    isError: isAdminError,
    error: adminError,
    isPending: isAdminPending,
  } = useQuery<Admin, ErrorResponse>({
    queryKey: [adminQueryKey, adminId],
    queryFn: () => fetchAdmin(adminId || ""),
    enabled: isString(adminId),
  });

  if (isAdminPending) {
    return (
      <div className="flex items-center justify-center w-full h-screen flex-col gap-4">
        <LoadingSpinner fill="blue-600" text="gray-400" dimension="16" />
        <h2 className="text-gray-500 font-semibold">Loading details...</h2>
      </div>
    );
  }

  if (isAdminError) {
    return (
      <div className="p-6">
        <ErrorAlert error={adminError as ErrorResponse} />
      </div>
    );
  }

  return (
    <PageTemplate title="Admin Details">
      <div className="flex flex-col lg:flex-row items-start justify-center lg:space-x-12 p-6 bg-gray-100 min-h-screen">
        {/* Admin Information Section */}
        {adminData && (
          <div className="flex flex-col items-center lg:items-start bg-white shadow-lg rounded-lg p-8 mb-8 lg:mb-0 w-full lg:w-1/3">
            <h2 className="text-3xl font-bold mb-6 text-center lg:text-left text-gray-800">
              Admin Details
            </h2>
            <img
              src={
                adminData.adminImage
                  ? `${SERVER_URL}/public/uploads/admin/${adminData.adminImage}`
                  : defaultUserPicture
              }
              alt="Admin"
              className="w-48 h-48 rounded-full object-cover shadow-md mb-6"
            />
            <p className="text-lg text-gray-600">
              <span className="font-semibold">Email: </span>
              {adminData.adminEmail}
            </p>
          </div>
        )}
        <DataTable<Activity, ActivityFilterParams>
          fetchItems={fetchActivities}
          fetchDataParams={params}
          initialParams={params}
          updateParams={handleUpdateArgs}
          renderTableContent={({
            dataEntries: activities,
            updateFilterParams,
          }) => ({
            ContentRenderer: () => (
              <ul className="space-y-6">
                {activities.map((item, index) => (
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
              <AdminActivityDropdown
                params={params}
                updateFilterParams={updateFilterParams}
              />
            ),
          })}
          queryKey={activityQueryKey}
        />
      </div>
    </PageTemplate>
  );
};

export default AdminDetails;
