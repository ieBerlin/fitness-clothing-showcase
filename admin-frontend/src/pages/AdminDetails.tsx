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

import defaultUserPicture from "/default-profile.jpg";
import {
  ActivityFilterParams,
  defaultFilterParams,
} from "../types/activityFilters";
import AdminActivityDropdown from "../components/AdminActivityDropdown";
import ActivityLogItem from "../components/ActivityLogItem";

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
      <div className="flex flex-col">
        {/* Admin Information Section */}
        {adminData && (
          <div className="flex flex-row items-center bg-white p-6 mb-2 w-full border border-gray-200">
            <img
              src={
                adminData.adminImage
                  ? `${SERVER_URL}/public/uploads/admin/${adminData.adminImage}`
                  : defaultUserPicture
              }
              alt="Admin"
              className="w-36 h-36 rounded-full object-cover mb-6 border-4 border-gray-300"
            />
            <div className="ml-6 flex flex-col">
              <p className="text-lg font-medium text-gray-700 mb-1">
                <span className="font-semibold text-black">Email: </span>
                {adminData.adminEmail}
              </p>
              <p className="text-lg font-medium text-gray-700 mb-1">
                <span className="font-semibold text-black">Last Login: </span>
                {!adminData.lastLoginAt ? (
                  <span className="mt-2 text-sm text-red-500 italic">
                    This Admin has never logged in.
                  </span>
                ) : (
                  <span className="mt-2 text-lg font-medium text-gray-700">
                    {new Date(adminData.lastLoginAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                      hour12: true,
                    })}
                  </span>
                )}
              </p>
            </div>
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
                {activities.map((item) => (
                  <ActivityLogItem activityItem={item} key={item._id} />
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
