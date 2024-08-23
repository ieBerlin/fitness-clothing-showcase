import { ReactNode, useRef } from "react";
import PageTemplate from "../components/PageTemplate";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import SearchInput from "../components/SearchInput";
import { API_URL, queryClient } from "../utils/http";
import LoadingSpinner from "../components/LoadingSpinner";
import StyledAvailability from "../components/StyledAvailability";
import { debounce } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { authHeader } from "../services/auth-header.service";
import {
  Availability,
  Product,
  ProductsResponse,
} from "../types/product.types";
import DropdownMenu from "../components/DropdownMenu";
import { openModal } from "../features/modal";
import { useDispatch } from "react-redux";
import { ModalType } from "../types/modal.types";
import { Link } from "react-router-dom";

function ManageProducts() {
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    // Extract search query from inputRef
    const searchQuery = inputRef.current?.value || "";

    // Construct query string
    const queryParams = new URLSearchParams();
    if (searchQuery) {
      queryParams.append("search", searchQuery);
    }
    // Add other query parameters if needed (e.g., filters, pagination)

    // Construct the URL with query parameters
    const url = `${API_URL}product/?${queryParams.toString()}`;

    // Fetch products from API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-access-token": authHeader().token,
      },
    });

    // Handle response errors
    if (!response.ok) {
      throw new Error(`Error ${response.status}: Failed to fetch products`);
    }

    // Parse and return the response data
    const data: ProductsResponse = await response.json();

    // Handle server errors
    if (!data.success) {
      throw new Error("Server refused to show products");
    }

    return data;
  };

  const {
    isFetching,
    isError,
    data: productsData,
  } = useQuery<ProductsResponse>({
    queryKey: ["products", inputRef.current?.value],
    queryFn: fetchProducts,
  });
  const dispatch = useDispatch();
  const handleDeleteButton = (product: Product) => {
    dispatch(openModal({ type: ModalType.DELETE_PRODUCT, data: product }));
  };

  const handleInputChange = debounce(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  }, 300);

  function handleAddProduct() {
    dispatch(openModal({ type: "product-added-success" }));
  }
  const renderContent = (): ReactNode => {
    if (isFetching) {
      return (
        <div className="flex items-center justify-center w-full py-10 flex-col gap-2">
          <LoadingSpinner fill="blue-600" text="gray-400" dimension="16" />
          <h2 className="text-gray-500 font-semibold">Loading...</h2>
        </div>
      );
    }

    if (isError) {
      return <div className="text-red-600">Error occurred!</div>;
    }

    if (!productsData || productsData.products.length === 0) {
      return <div className="text-gray-600">Nothing to show!</div>;
    }

    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {[
              "Product",
              "Price",
              "Availability",
              "Colors",
              "Unisex",
              "Release Date",
              "",
            ].map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {productsData.products.map((product) => {
            const {
              _id,
              productName,
              price,
              availability,
              isUnisex,
              releaseDate,
            } = product;
            const colors = product.colors.map((color) => color.name);
            const formattedDate = new Date(releaseDate).toLocaleString(
              "en-US",
              {
                day: "numeric",
                weekday: "short",
                month: "long",
                year: "numeric",
              }
            );

            return (
              <tr key={_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                  {price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium mx-auto">
                  <StyledAvailability status={availability as Availability} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                  {colors.join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                  {isUnisex ? "Yes" : "No"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                  {formattedDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                  <DropdownMenu
                    position="top-1 right-1"
                    label={
                      <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                    }
                    content={
                      <div>
                        <Link
                          to={`/products/${_id}/edit`}
                          type="button"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        >
                          Edit Product
                        </Link>
                        <button
                          onClick={() => handleDeleteButton(product)}
                          type="button"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        >
                          Delete Product
                        </button>
                      </div>
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };
  const numOfProducts = productsData?.products.length ?? 0;
  return (
    <PageTemplate title="All Products">
      <div className="flex w-full justify-end mb-4">
        <button
          className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-500"
          onClick={handleAddProduct}
          type="button"
        >
          Add Product
        </button>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="bg-white px-2 py-1 border border-gray-300 rounded-md">
          <h2 className="text-gray-800 font-semibold text-md">
            All
            <span className="text-gray-400 font-semibold text-sm">
              {" "}
              {numOfProducts}
            </span>
          </h2>
        </div>
        <div className="w-full md:w-3/5 lg:w-1/2 mt-4 md:mt-0">
          <SearchInput onChange={handleInputChange} ref={inputRef} />
        </div>
      </div>
      {renderContent()}
    </PageTemplate>
  );
}

export default ManageProducts;
