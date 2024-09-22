import React, { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTemplate from "../components/PageTemplate";
import TextInput from "../components/TextInput";
import { ActivityItem } from "./Dashboard";
import { FaKey, FaUserCircle } from "react-icons/fa";
import { useQueries } from "@tanstack/react-query";
import { fetchMyActivities, fetchMyProfile } from "../utils/authUtils";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import DropdownMenu from "../components/DropdownMenu";
import { queryClient } from "../utils/http";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import { ErrorResponse } from "../types/response";
const options = [10, 20, 50, 100];

const ViewProfilePage: React.FC = () => {
  const [filterArgs, setFilterArgs] = useState<{
    limit: number;
    page: number;
  }>({
    limit: options[0],
    page: 1,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["my-activities"] });
  }, [filterArgs]);

  const results = useQueries({
    queries: [
      {
        queryKey: ["my-activities"],
        queryFn: () => fetchMyActivities({ ...filterArgs }),
      },
      {
        queryKey: ["basic-informations"],
        queryFn: fetchMyProfile,
      },
    ],
  });

  // Destructure activities and profile fetch states
  const {
    isFetching: isFetchingActivities,
    data: activities,
    isError: isErrorActivities,
    error: activitiesError,
  } = results[0];

  const {
    isFetching: isFetchingProfile,
    data: profile,
    isError: isErrorProfile,
    error: profileError,
  } = results[1];

  // Handle showing options for activities
  const handleShowingOptionChange = (data: number, key: string) => {
    setFilterArgs((prevState) => ({ ...prevState, [key]: data }));
  };

  // Conditional content for activities section
  let activitiesContent: ReactNode = <div></div>;
  if (isFetchingActivities) {
    activitiesContent = (
      <div className="flex items-center justify-center w-full py-10 flex-col gap-2">
        <LoadingSpinner fill="blue-600" text="gray-400" dimension="16" />
        <h2 className="text-gray-500 font-semibold">Loading activities...</h2>
      </div>
    );
  } else if (isErrorActivities) {
    activitiesContent = (
      <div className="space-y-4">
        <ErrorAlert error={activitiesError as unknown as ErrorResponse} />
      </div>
    );
  } else if (activities?.activities && activities?.activities.length > 0) {
    activitiesContent = (
      <ul className="space-y-4">
        {activities.activities.map((activity) => (
          <ActivityItem key={activity._id} activity={activity} />
        ))}
      </ul>
    );
  } else {
    activitiesContent = <div>No activities to show</div>;
  }

  // Conditional content for basic information section
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
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Basic Information
        </h2>
        {profileContent}
      </section>

      {/* Section for Profile Actions */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Profile Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="/profile/change-password"
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            <FaKey className="mr-2 text-blue-600" />
            <span className="text-blue-600 text-sm font-medium">
              Change Password
            </span>
          </Link>
          <Link
            to="/profile/update-picture"
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            <FaUserCircle className="mr-2 text-blue-600" />
            <span className="text-blue-600 text-sm font-medium">
              Update Profile Picture
            </span>
          </Link>
        </div>
      </section>

      {/* Section for Activities */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          My Recent Activities
        </h2>
        <div className="w-full flex flex-row justify-end mb-2">
          <DropdownMenu
            label={
              <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-50 text-gray-800 shadow-sm">
                <span className="text-lg font-semibold">
                  Showing {filterArgs.limit}
                </span>
                <ChevronDoubleDownIcon className="w-4 h-4 text-gray-600" />
              </div>
            }
            content={
              <ul className="space-y-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {options.map((option) => (
                  <li
                    key={option}
                    className="cursor-pointer hover:bg-gray-100 active:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out"
                    onClick={() => handleShowingOptionChange(option, "limit")}
                  >
                    <span className="text-gray-800 font-medium">{option}</span>
                  </li>
                ))}
              </ul>
            }
          />
        </div>
        {activitiesContent}
      </section>
    </PageTemplate>
  );
};

export default ViewProfilePage;
