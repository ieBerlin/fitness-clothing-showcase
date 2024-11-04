import React, { ReactNode, useCallback, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAdmin, fetchActivities } from "../utils/authUtils";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { isString } from "lodash";
import { ErrorResponse } from "../types/response";
import Admin from "../models/Admin";
import DataTable from "../components/DataTable";
import {
  defaultUserPicture,
  ExtendedFilterParams,
  queryClient,
  SERVER_URL,
} from "../utils/http";

import {
  ActivityFilterParams,
  defaultFilterParams,
} from "../types/activityFilters";
import AdminActivityDropdown from "../components/AdminActivityDropdown";
import ActivityLogItem from "../components/ActivityLogItem";
import { openModal } from "../features/modal";
import { ModalType } from "../enums/ModalType";
import { useDispatch } from "react-redux";
import Notification from "../models/Notification";
import { getQueryKey } from "../constants/queryKeys";

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
  const managerData = queryClient.getQueryData(getQueryKey("admins")) as Admin;
  const dispatch = useDispatch();
  const {
    data: adminData,
    isError: isAdminError,
    error: adminError,
    isPending: isAdminPending,
  } = useQuery<Admin, ErrorResponse>({
    queryKey: getQueryKey("admins"),
    queryFn: () => fetchAdmin(adminId || ""),
    enabled: isString(adminId),
  });
  let content: ReactNode;
  const canBeEdited =
    typeof adminData?._id === "string" &&
    adminData.role === "admin" &&
    managerData &&
    managerData.role === "manager";
  if (isAdminPending) {
    return (content = (
      <LoadingSpinner title={"Fetching data, please wait..."} />
    ));
  } else if (isAdminError) {
    return (content = (
      <div className="p-6">
        <ErrorAlert error={adminError as ErrorResponse} />
      </div>
    ));
  } else {
    function handleEditAdmin() {
      dispatch(
        openModal({
          type: ModalType.EDIT_ADMIN,
          data: adminData,
        })
      );
    }
    content = (
      <div className="flex flex-col h-full">
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
              <p className="text-lg font-medium text-gray-700 mb-1">
                <span className="font-semibold text-black">Position: </span>
                {adminData.role}
              </p>
            </div>
            {canBeEdited && (
              <div className="ml-auto flex items-start h-full">
                <button
                  onClick={handleEditAdmin}
                  className="bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-teal-700 active:bg-teal-800 transition duration-300 ease-in-out flex items-center space-x-2 "
                >
                  <span>Edit Admin</span>
                </button>
              </div>
            )}
          </div>
        )}
        <DataTable<Notification, ActivityFilterParams>
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
          queryKey={getQueryKey("activities")}
        />
      </div>
    );
  }
  return <PageTemplate title="Admin Details">{content}</PageTemplate>;
};

export default AdminDetails;
