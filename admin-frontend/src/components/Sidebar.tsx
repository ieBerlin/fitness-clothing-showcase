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
import SpinnerWithMessage from "./SpinnerWithMessage";

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
    <aside className="bg-[#171717] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-center mx-auto">
          {isFetchingProfile ? (
            <SpinnerWithMessage message={"Loading Profile"} />
          ) : isErrorProfile ? (
            <h2 className="text-red-400 font-semibold">
              Error loading profile
            </h2>
          ) : (
            <div>
              {profile?.fullName && (
                <h3 className="text-gray-200 text-sm font-bold">
                  {profile?.fullName}
                </h3>
              )}
              <h3 className="text-gray-200 text-sm font-bold">
                {profile?.adminEmail}
              </h3>
            </div>
          )}
        </div>
      </div>
      <hr className="border-gray-700 mb-6" />
      <ul className="space-y-4">
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
