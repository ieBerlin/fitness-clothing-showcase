import PageTemplate from "../components/PageTemplate";
import {
  UserGroupIcon,
  ShoppingCartIcon,
  EyeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  currentMonthSections,
  previousMonthSections,
} from "../dummy-data/sections";
import { FC, ReactNode } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import {
  DataResponse,
  ErrorResponse,
  StatisticsResponse,
} from "../types/response";
import {
  fetchActivities,
  fetchAdmin,
  fetchStatistics,
} from "../utils/authUtils";
import Activity from "../models/Activity";
import Admin from "../models/Admin";
import { Link } from "react-router-dom";
import { activityQueryKey, statisticQueryKey } from "../constants/queryKeys";
import { defaultFilterParams } from "../types/activityFilters";
interface ActivityItemProps {
  activity: Activity;
}

export const ActivityItem: FC<ActivityItemProps> = ({ activity }) => {
  const {
    isError,
    error,
    isFetching,
    data: adminData,
  } = useQuery<Admin, ErrorResponse>({
    queryKey: activityQueryKey,
    queryFn: () => fetchAdmin(activity.adminId),
    staleTime: Infinity,
  });

  const formattedDate = new Date(activity.timestamp).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  let content: ReactNode;
  if (isFetching) {
    content = <LoadingSpinner title={"Fetching data, please wait..."} />;
  } else if (isError) {
    content = (
      <div className="w-full py-10">
        <ErrorAlert error={error} />
      </div>
    );
  } else {
    content = (
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-col">
          <p className="text-gray-800 font-semibold">
            {activity.activityType
              .split("_")
              .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
              .join(" ")}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {activity.entityType} by{" "}
            <Link to={`/admin/${activity.adminId}`}>
              <span className="font-medium text-gray-800">
                {adminData?.adminEmail}
              </span>
            </Link>
          </p>
        </div>
        <div className="flex items-center justify-center flex-col gap-2">
          <p className="text-gray-500 text-sm font-semibold">{formattedDate}</p>
          <Link
            to={`/activity/${activity._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <li className="flex items-center justify-between p-4 bg-white border border-gray-200 hover:bg-gray-50 transition duration-200 ease-in-out">
      {content}
    </li>
  );
};

function Dashboard() {
  const results = useQueries<
    [
      [DataResponse<Activity>, ErrorResponse],
      [StatisticsResponse, ErrorResponse]
    ]
  >({
    queries: [
      {
        queryKey: activityQueryKey,
        queryFn: () => fetchActivities(defaultFilterParams),
        staleTime: Infinity,
      },
      {
        queryKey: statisticQueryKey,
        queryFn: fetchStatistics,
        staleTime: Infinity,
      },
    ],
  });

  const isFetching = results.some((query) => query.isFetching);
  const isError = results.some((result) => result.isError);
  const error = results.map(
    (result) => result.error as unknown as ErrorResponse
  );
  const activities = (results[0]?.data || []) as Activity[];
  const statistics = results[1].data;
  let renderedContent: ReactNode;
  if (isFetching) {
    renderedContent = <LoadingSpinner title={"Preparing your dashboard..."} />;
  } else if (isError) {
    renderedContent = (
      <div className="space-y-4">
        {error.map((item) => (
          <ErrorAlert error={item} />
        ))}
      </div>
    );
  } else
    renderedContent = (
      <div className="bg-white p-4 border border-gray-200">
        <div>
          <h2 className="text-gray-700 font-bold text-xl mb-6">
            This Month's Snapshot
          </h2>
          <ul className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <li className="bg-yellow-100 flex items-center justify-between p-6 transition-transform duration-300 ease-in-out border border-yellow-300 hover:scale-105">
              <div>
                <h2 className="text-yellow-900 font-extrabold text-3xl">
                  {statistics?.totalAdmins ?? 0}
                </h2>
                <p className="text-yellow-700 text-sm font-medium mt-1">
                  Total Admins
                </p>
              </div>
              <UserGroupIcon className="w-12 h-12 text-yellow-900" />
            </li>
            <li className="bg-pink-100 flex items-center justify-between p-6 transition-transform duration-300 ease-in-out border border-pink-300 hover:scale-105">
              <div>
                <h2 className="text-pink-900 font-extrabold text-3xl">
                  {statistics?.totalProducts ?? 0}
                </h2>
                <p className="text-pink-700 text-sm font-medium mt-1">
                  Total Products
                </p>
              </div>
              <ShoppingCartIcon className="w-12 h-12 text-pink-900" />
            </li>
            <li className="bg-purple-100 flex items-center justify-between p-6 transition-transform duration-300 ease-in-out border border-purple-300 hover:scale-105">
              <div>
                <h2 className="text-purple-900 font-extrabold text-3xl">
                  {statistics?.totalTraffic ?? 0}
                </h2>
                <p className="text-purple-700 text-sm font-medium mt-1">
                  Site Traffic
                </p>
              </div>
              <EyeIcon className="w-12 h-12 text-purple-900" />
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-300" />
        <div>
          <h2 className="text-gray-700 font-bold text-xl mb-6">
            This Month's Performance
          </h2>
          <ul className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {currentMonthSections.map((section) => {
              const currentSection = currentMonthSections.find(
                (sec) => sec._id === section._id
              );
              const previousSection = previousMonthSections.find(
                (sec) => sec._id === section._id
              );

              if (!currentSection || !previousSection) return null;

              const difference =
                currentSection.items.length - previousSection.items.length;
              const differenceColor =
                difference > 0 ? "text-emerald-600" : "text-red-600";
              const differenceBackgroundColor =
                difference > 0 ? "bg-emerald-100" : "bg-red-100";

              return (
                <li className="bg-sky-100 p-6 flex items-center justify-between border border-sky-300 duration-300 ease-in-out hover:scale-105">
                  <div>
                    <p className="text-gray-700 font-medium capitalize">
                      {section.name.replace(/-/g, " ")}
                    </p>
                    <h2 className="text-gray-900 text-3xl font-bold">
                      {currentSection.items.length}
                    </h2>
                    <h3 className="text-sm font-normal text-gray-600 mt-1">
                      {`Compared to last month, ${
                        difference > 0 ? "a rise" : "a decline"
                      } of `}
                      <span className={`font-semibold ${differenceColor}`}>
                        {Math.abs(difference)}
                      </span>
                    </h3>
                  </div>
                  <div
                    className={`font-semibold ${differenceColor} ${differenceBackgroundColor} inline-block px-3 py-1 rounded-full text-xs`}
                  >
                    {(
                      (difference / previousSection.items.length) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <hr className="my-6 border-gray-300" />
        <div>
          <div className="flex items-center mb-6">
            <ClockIcon className="w-6 h-6 text-gray-700 mr-2" />
            <h2 className="text-gray-700 font-bold text-xl">
              Last 7 Days' Activities
            </h2>
          </div>
          {activities.length > 0 ? (
            <ul className="space-y-3">
              {activities.map((activity) => (
                <ActivityItem key={activity._id} activity={activity} />
              ))}
            </ul>
          ) : (
            <h2 className="text-gray-500 text-center font-medium text-lg p-4 border border-gray-300 rounded-md bg-gray-100">
              No Recent Activities
            </h2>
          )}
        </div>
      </div>
    );

  return <PageTemplate title="Dashboard">{renderedContent}</PageTemplate>;
}

export default Dashboard;
