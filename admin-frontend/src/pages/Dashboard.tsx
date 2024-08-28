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
  systemActivities,
} from "../dummy-data/sections";
import { FC } from "react";

const SectionStatistic: FC<{ sectionId: string; name: string }> = ({
  sectionId,
  name,
}) => {
  const currentSection = currentMonthSections.find(
    (section) => section.sectionId === sectionId
  );
  const previousSection = previousMonthSections.find(
    (section) => section.sectionId === sectionId
  );

  if (!currentSection || !previousSection) return null;

  const difference = currentSection.items - previousSection.items;
  const differenceColor = difference > 0 ? "text-emerald-600" : "text-red-600";
  const differenceBackgroundColor =
    difference > 0 ? "bg-emerald-100" : "bg-red-100";

  return (
    <li className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
      <div>
        <p className="text-gray-700 font-medium">{name}</p>
        <h2 className="text-gray-900 text-3xl font-bold">
          {currentSection.items}
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
              <h2 className="text-blue-900 font-extrabold text-3xl">3,000</h2>
              <p className="text-blue-700 text-sm font-medium mt-1">
                Total Admins
              </p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-blue-900" />
          </li>
          <li className="bg-emerald-50 rounded-lg flex items-center justify-between p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div>
              <h2 className="text-emerald-900 font-extrabold text-3xl">
                3,000
              </h2>
              <p className="text-emerald-700 text-sm font-medium mt-1">
                Total Products
              </p>
            </div>
            <ShoppingCartIcon className="w-12 h-12 text-emerald-900" />
          </li>
          <li className="bg-red-50 rounded-lg flex items-center justify-between p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div>
              <h2 className="text-red-800 font-extrabold text-3xl">3,000</h2>
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
        <ul className="space-y-3">
          {systemActivities.map((activity, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm border border-gray-200"
            >
              <div className="text-gray-800">
                <p className="font-medium">{activity.productName}</p>
                <p className="text-sm text-gray-600">
                  {activity.action} by{" "}
                  <span className="font-medium text-gray-800">
                    {activity.user}
                  </span>
                </p>
              </div>
              <p className="text-gray-500 text-sm font-semibold">
                {activity.date}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </PageTemplate>
  );
}

export default Dashboard;
