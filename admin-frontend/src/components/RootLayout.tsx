import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { verifyToken } from "../services/admin.service";

function RootLayout() {
  return (
    <div className="flex flex-row min-h-screen bg-gray-50 text-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
export async function loader() {
  await verifyToken();
  return null;
}
