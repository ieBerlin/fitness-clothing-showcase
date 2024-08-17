import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ManageProducts from "./pages/ManageProducts";
import ManageSections from "./pages/ManageSections";
import AnalyticsOverview from "./pages/AnalyticsOverview";
import NotFoundPage from "./pages/NotFoundPage";
import GlobalError from "./pages/GlobalError";
import Notifications from "./pages/Notifications";
import AdminActivity from "./pages/AdminActivity";
import ProductDetails from "./pages/ProductDetails";
import SectionDetails from "./pages/SectionDetails";
import EditProduct from "./pages/EditProduct";
import EditSection from "./pages/EditSection";
import ActivityDetails from "./pages/ActivityDetails";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import UpdateProfilePicturePage from "./pages/UpdateProfilePicturePage";
import ViewProfilePage from "./pages/ViewProfilePage";
import AdminProfile from "./pages/AdminProfile";
import AdminDetails from "./pages/AdminDetails";

const routes = createBrowserRouter([
  {
    path: "/",
    errorElement: <GlobalError />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "products",
        children: [
          {
            index: true,
            element: <ManageProducts />,
          },
          {
            path: ":productId",
            children: [
              {
                index: true,
                element: <ProductDetails />,
              },
              {
                path: "edit",
                element: <EditProduct />,
              },
            ],
          },
        ],
      },
      {
        path: "sections",
        children: [
          {
            index: true,
            element: <ManageSections />,
          },
          {
            path: ":sectionId",
            children: [
              {
                index: true,
                element: <SectionDetails />,
              },
              {
                path: "edit",
                element: <EditSection />,
              },
            ],
          },
        ],
      },
      {
        path: "analytics",
        element: <AnalyticsOverview />,
      },
      {
        path: "profile",
        children: [
          {
            index: true,
            element: <ViewProfilePage />,
          },
          {
            path: "update-picture",
            element: <UpdateProfilePicturePage />,
          },
          {
            path: "change-password",
            element: <ChangePasswordPage />,
          },
        ],
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "activity",
        children: [
          {
            index: true,
            element: <AdminActivity />,
          },
          {
            path: ":adminId",
            element: <ActivityDetails />,
          },
        ],
      },
    ],
  },
  {
    path: "admin",
    children: [
      {
        index: true,
        element: <AdminProfile />,
      },
      {
        path: ":adminId",
        element: <AdminDetails />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default routes;
