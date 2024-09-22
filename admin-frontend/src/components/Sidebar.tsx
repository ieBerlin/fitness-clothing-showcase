import {
  CogIcon,
  UserCircleIcon,
  HomeIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import SidebarItem from "./SidebarItem";
import { useQuery } from "@tanstack/react-query";
import { fetchMyProfile } from "../utils/authUtils";
import LoadingSpinner from "./LoadingSpinner";

function Sidebar() {
  const {
    isFetching: isFetchingProfile,
    data: profile,
    isError: isErrorProfile,
  } = useQuery({
    queryKey: ["basic-informations"],
    queryFn: fetchMyProfile,
    staleTime: Infinity,
  });
  return (
    <aside className="bg-gray-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-center mx-auto">
          {isFetchingProfile ? (
            <div className="flex items-center justify-center w-full py-4 flex-col gap-2">
              <LoadingSpinner fill="blue-600" text="gray-400" dimension="8" />
              <h2 className="text-gray-500 font-semibold">
                Loading profile...
              </h2>
            </div>
          ) : isErrorProfile ? (
            <h2 className="text-red-500 font-semibold">
              Error loading profile
            </h2>
          ) : (
            <h3 className="text-gray-300 text-sm">{profile?.adminEmail}</h3>
          )}
        </div>
      </div>
      <hr className="border-gray-700 mb-6" />
      <ul>
        <SidebarItem label="Dashboard" path="/dashboard" Icon={HomeIcon} />
        <SidebarItem label="Products" path="/products" Icon={ShoppingBagIcon} />
        <SidebarItem label="Sections" path="/sections" Icon={StarIcon} />
        <SidebarItem label="Analytics" path="/analytics" Icon={ChartBarIcon} />
        <SidebarItem label="Activity" path="/activity" Icon={UserCircleIcon} />
        <SidebarItem label="Admin" path="/admin" Icon={CogIcon} />
      </ul>
    </aside>
  );
}
export default Sidebar;
