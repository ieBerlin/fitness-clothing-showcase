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
import ErrorDisplay from "../components/ErrorDisplay";
import { ErrorResponse } from "../types/response";
import {
  fetchActivities,
  fetchAdmin,
  fetchStatistics,
} from "../utils/authUtils";
import Activity from "../models/Activity";
import Admin from "../models/Admin";
import { Link } from "react-router-dom";
interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: FC<ActivityItemProps> = ({ activity }) => {
  const {
    isError,
    error,
    isFetching,
    data: adminData,
  } = useQuery<Admin, ErrorResponse>({
    queryKey: [`admin-${activity.adminId}`],
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
    content = (
      <div className="flex flex-col items-center justify-center w-full py-2 space-y-1">
        <LoadingSpinner fill="blue-600" text="gray-400" dimension="12" />
        <h2 className="text-gray-600 font-medium text-sm">
          Loading activity...
        </h2>
      </div>
    );
  } else if (isError) {
    content = (
      <div className="w-full py-10">
        <ErrorDisplay error={error} />
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
    <li className="flex items-center justify-between p-4 bg-white rounded-md shadow-md border border-gray-200 hover:bg-gray-50 transition duration-200 ease-in-out">
      {content}
    </li>
  );
};

const SectionStatistic: FC<{ sectionId: string; name: string }> = ({
  sectionId,
  name,
}) => {
  const currentSection = currentMonthSections.find(
    (section) => section._id === sectionId
  );
  const previousSection = previousMonthSections.find(
    (section) => section._id === sectionId
  );

  if (!currentSection || !previousSection) return null;

  const difference = currentSection.items.length - previousSection.items.length;
  const differenceColor = difference > 0 ? "text-emerald-600" : "text-red-600";
  const differenceBackgroundColor =
    difference > 0 ? "bg-emerald-100" : "bg-red-100";

  return (
    <li className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
      <div>
        <p className="text-gray-700 font-medium">{name}</p>
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
        {((difference / 100) * 100).toFixed(2)}%
      </div>
    </li>
  );
};

function Dashboard() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["sections"],
        queryFn: fetchActivities,
        staleTime: Infinity,
      },
      {
        queryKey: ["statistics"],
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
  const activities = results[0]?.data?.activities || [];
  const statistics = results[1].data;
  if (isFetching) {
    return (
      <div className="flex items-center justify-center w-full py-10 flex-col gap-2">
        <LoadingSpinner fill="blue-600" text="gray-400" dimension="16" />
        <h2 className="text-gray-500 font-semibold">Loading sections...</h2>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="space-y-4">
        {error.map((item) => (
          <ErrorDisplay error={item} />
        ))}
      </div>
    );
  }

  return (
    <PageTemplate title="Dashboard">
      <div className="py-4">
        <h2 className="text-gray-700 font-bold text-xl mb-6">
          This Month's Snapshot
        </h2>
        <ul
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          <li className="bg-blue-50 rounded-lg flex items-center justify-between p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div>
              <h2 className="text-blue-900 font-extrabold text-3xl">
                {statistics?.totalAdmins ?? 0}
              </h2>
              <p className="text-blue-700 text-sm font-medium mt-1">
                Total Admins
              </p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-blue-900" />
          </li>
          <li className="bg-emerald-50 rounded-lg flex items-center justify-between p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div>
              <h2 className="text-emerald-900 font-extrabold text-3xl">
                {statistics?.totalProducts ?? 0}
              </h2>
              <p className="text-emerald-700 text-sm font-medium mt-1">
                Total Products
              </p>
            </div>
            <ShoppingCartIcon className="w-12 h-12 text-emerald-900" />
          </li>
          <li className="bg-red-50 rounded-lg flex items-center justify-between p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div>
              <h2 className="text-red-800 font-extrabold text-3xl">
                {" "}
                {statistics?.totalTraffic ?? 0}
              </h2>
              <p className="text-red-700 text-sm font-medium mt-1">
                Site Traffic
              </p>
            </div>
            <EyeIcon className="w-12 h-12 text-red-900" />
          </li>
        </ul>
      </div>
      <hr className="my-6 border-gray-300" />
      <div>
        <h2 className="text-gray-700 font-bold text-xl mb-6">
          This Month's Performance
        </h2>
        <ul
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          }}
        >
          <SectionStatistic sectionId="section1" name="Popular Products" />
          <SectionStatistic sectionId="section2" name="New Arrivals" />
          <SectionStatistic sectionId="section3" name="Trending Now" />
          <SectionStatistic sectionId="section4" name="On Sale" />
        </ul>
      </div>
      <hr className="my-6 border-gray-300" />
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <ClockIcon className="w-6 h-6 text-gray-700 mr-2" />
          <h2 className="text-gray-700 text-lg font-semibold">
            Last 3 Days' Activities
          </h2>
        </div>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ul className="space-y-3">
              <ActivityItem key={activity._id} activity={activity} />
            </ul>
          ))
        ) : (
          <h2 className="text-gray-500 text-center font-medium text-lg p-4 border border-gray-300 rounded-md bg-gray-100 shadow-sm">
            No recent activities
          </h2>
        )}
      </div>
    </PageTemplate>
  );
}

export default Dashboard;
