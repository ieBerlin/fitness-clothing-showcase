import {
    CogIcon,
    UserCircleIcon,
    HomeIcon,
    ChartBarIcon,
    ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import SidebarItem from "./SidebarItem";
const adminDetails = {
    firstName: "ieBerlin",
    lastName: "Schizo",
    email: "aeourmassi@gmail.com",
};

function Sidebar() {
    return <aside className="bg-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
            <div className="text-center mx-auto">
                <h2 className="text-white text-lg font-semibold">
                    {adminDetails.firstName} {adminDetails.lastName}
                </h2>
                <h3 className="text-gray-300 text-sm">{adminDetails.email}</h3>
            </div>
        </div>
        <hr className="border-gray-700 mb-6" />
        <ul>
            <SidebarItem label="Dashboard" path="/dashboard" Icon={HomeIcon} />
            <SidebarItem
                label="Products"
                path="/products"
                Icon={ShoppingBagIcon}
            />
            <SidebarItem
                label="Analytics"
                path="/analytics"
                Icon={ChartBarIcon}
            />
            <SidebarItem
                label="Activity"
                path="/activity"
                Icon={UserCircleIcon}
            />
            <SidebarItem label="Admin" path="/admin" Icon={CogIcon} />
        </ul>
    </aside>
}
export default Sidebar;