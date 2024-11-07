import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import SectionPage from "./pages/SectionPage";
import NotFoundPage from "./pages/NotFoundPage";
import GlobalError from "./pages/GlobalError";
import RootLayout from "./components/RootLayout.tsx";
import MenProductsPage from "./pages/MenProductsPage.tsx";
import WomenProductsPage from "./pages/WomenProductsPage.tsx";
import UnisexProductsPage from "./pages/UnisexProductsPage.tsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <GlobalError />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "collections/men",
        element: <MenProductsPage />,
      },
      { path: "collections/women", element: <WomenProductsPage /> },
      { path: "collections/unisex", element: <UnisexProductsPage /> },
      {
        path: "products/:productId",
        element: <ProductDetailsPage />,
      },
      {
        path: "sections/:sectionId",
        element: <SectionPage />,
      },
    ],
  },
  {
    path: "/products",
    element: <ProductListingPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
export default routes;
