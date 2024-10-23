import React, { ReactNode, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import PageTemplate from "../components/PageTemplate";
import TextInput from "../components/TextInput";
import { FaKey, FaUserCircle, FaIdCard } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchMyActivities, fetchMyProfile } from "../utils/authUtils";
import { ExtendedFilterParams } from "../utils/http";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import { ErrorResponse } from "../types/response";
import Activity from "../models/Activity";
import {
  ActivityFilterParams,
  defaultFilterParams,
} from "../types/activityFilters";
import DataTable from "../components/DataTable";
import { activityQueryKey } from "../constants/queryKeys";
import AdminActivityDropdown from "../components/AdminActivityDropdown";
import ActivityLogItem from "../components/ActivityLogItem";
import Admin from "../models/Admin";
const ViewProfilePage: React.FC = () => {
  const {
    isFetching: isFetchingProfile,
    data: profile,
    isError: isErrorProfile,
    error: profileError,
  } = useQuery<Admin, ErrorResponse>({
    queryKey: ["basic-informations"],
    queryFn: () => fetchMyProfile(),
  });

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

  let profileContent: ReactNode = <div></div>;
  if (isFetchingProfile) {
    profileContent = (
      <div className="flex items-center justify-center w-full py-10 flex-col gap-2">
        <LoadingSpinner fill="blue-600" text="gray-400" dimension="16" />
        <h2 className="text-gray-500 font-semibold">Loading profile...</h2>
      </div>
    );
  } else if (isErrorProfile) {
    profileContent = (
      <div className="space-y-4">
        <ErrorAlert error={profileError as unknown as ErrorResponse} />
      </div>
    );
  } else if (profile) {
    profileContent = (
      <TextInput
        disabled
        label="Email"
        placeholder={profile.adminEmail}
        name="email"
        readOnly
      />
    );
  } else {
    profileContent = <div>No profile information available</div>;
  }

  return (
    <PageTemplate title="My Profile">
      {/* Section for Basic Information */}
      <section className="mb-10 p-6 bg-white border border-gray-200 rounded-sm shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Basic Information
        </h2>
        {profileContent}
      </section>

      {/* Section for Profile Actions */}
      <section className="mb-10 p-6 bg-white border border-gray-200 rounded-sm shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Profile Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <Link
            to="/profile/change-password"
            className="flex items-center justify-center p-4 border border-gray-300 hover:bg-blue-100 transition transform hover:scale-105 rounded-sm"
          >
            <FaKey className="mr-2 text-blue-600 text-xl" />
            <span className="text-blue-600 text-sm font-semibold">
              Change Password
            </span>
          </Link>
          <Link
            to="/profile/update-details"
            className="flex items-center justify-center p-4 border border-gray-300 hover:bg-blue-100 transition transform hover:scale-105 rounded-sm"
          >
            <FaIdCard className="mr-2 text-blue-600 text-xl" />
            <span className="text-blue-600 text-sm font-semibold">
              Update Personal Details
            </span>
          </Link>
          <Link
            to="/profile/update-picture"
            className="flex items-center justify-center p-4 border border-gray-300 hover:bg-blue-100 transition transform hover:scale-105 rounded-sm"
          >
            <FaUserCircle className="mr-2 text-blue-600 text-xl" />
            <span className="text-blue-600 text-sm font-semibold">
              Update Profile Picture
            </span>
          </Link>
        </div>
      </section>

      {/* Section for Activities */}
      <section className="p-6 bg-white border border-gray-200 rounded-sm shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          My Recent Activities
        </h2>

        <DataTable<Activity, ActivityFilterParams>
          fetchItems={fetchMyActivities}
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
      </section>
    </PageTemplate>
  );
};

export default ViewProfilePage;
