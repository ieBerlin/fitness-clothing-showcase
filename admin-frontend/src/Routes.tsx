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
import AddProduct from "./pages/AddProduct";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import UpdateProfilePicturePage from "./pages/UpdateProfilePicturePage";
import ViewProfilePage from "./pages/ViewProfilePage";
import AdminProfile from "./pages/AdminProfile";
import AdminDetails from "./pages/AdminDetails";
import RootLayout, {
  loader as authenticatedLoader,
} from "./components/RootLayout";
import { loader as loginLoader } from "./utils/http";
import UpdateDetailsPage from "./pages/UpdateDetailsPage";

const routes = createBrowserRouter([
  {
    index: true,
    element: <LoginPage />,
    loader: loginLoader,
  },
  {
    path: "/",
    loader: authenticatedLoader,
    element: <RootLayout />,
    errorElement: <GlobalError />,
    children: [
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
            path: "add",
            element: <AddProduct />,
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
            path: "update-details",
            element: <UpdateDetailsPage />,
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
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default routes;
