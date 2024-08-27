import { ReactNode, useRef } from "react";
import PageTemplate from "../components/PageTemplate";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import SearchInput from "../components/SearchInput";
import LoadingSpinner from "../components/LoadingSpinner";
import StyledAvailability from "../components/StyledAvailability";
import { debounce } from "lodash";
import { useQueries } from "@tanstack/react-query";
import {
  Availability,
  ErrorResponse,
  Product,
  SuccessResponse,
} from "../types/product.types";
import DropdownMenu from "../components/DropdownMenu";
import { openModal } from "../features/modal";
import { useDispatch } from "react-redux";
import { ModalType } from "../types/modal.types";
import { Link } from "react-router-dom";
import { fetchProduct, fetchProductsCount } from "../utils/authUtils";
import ErrorDisplay from "../components/ErrorDisplay";
import { queryClient } from "../utils/http";

function ManageProducts() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const queriesResults = useQueries({
    queries: [
      {
        queryKey: ["products", inputRef.current?.value || ""],
        queryFn: () =>
          fetchProduct({ productId: inputRef.current?.value || "" }),
        staleTime: Infinity,
        enabled: Boolean(inputRef.current?.value), // Conditionally enabled
      },
      {
        queryKey: ["products-count"],
        queryFn: fetchProductsCount,
      },
    ],
  });

  const [
    {
      isFetching: isProductsLoading,
      isError: hasProductsError,
      data: productsData,
      error: productsErrors,
    },
    {
      isFetching: isCountLoading,
      isError: hasCountError,
      data: productsCountData,
      error: countErrors,
    },
  ] = queriesResults;

  const isLoading = isProductsLoading || isCountLoading;
  const hasError = hasProductsError || hasCountError;

  const handleDeleteButton = (product: Product) => {
    dispatch(openModal({ type: ModalType.DELETE_PRODUCT, data: product }));
  };

  const handleInputChange = debounce(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  }, 300);

  const renderTableOrMessage = (): ReactNode => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center w-full py-10 flex-col gap-2">
          <LoadingSpinner fill="blue-600" text="gray-400" dimension="16" />
          <h2 className="text-gray-500 font-semibold">Loading...</h2>
        </div>
      );
    }

    if (hasError) {
      const errors: ErrorResponse[] = [];
      if (hasProductsError) {
        errors.push(productsErrors as unknown as ErrorResponse);
      }
      if (hasCountError) {
        errors.push(countErrors as unknown as ErrorResponse);
      }

      return (
        <div className="space-y-4">
          {errors.map((error, index) => (
            <ErrorDisplay key={index} error={error} />
          ))}
        </div>
      );
    }

    if (
      !productsData ||
      (productsData?.success &&
        (productsData as SuccessResponse).data.products.length === 0)
    ) {
      return (
        <div className="flex items-center justify-center w-full py-10">
          <h2 className="text-gray-600 font-semibold">
          No Products Found
          </h2>
        </div>
      );
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
          {(productsData as SuccessResponse).data.products.map(
            (product: Product) => {
              const {
                _id,
                productName,
                price,
                availability,
                isUnisex,
                releaseDate,
                colors,
              } = product;
              const formattedDate = new Date(releaseDate).toLocaleDateString(
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    <StyledAvailability status={availability as Availability} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    {colors.map((color) => color.name).join(", ")}
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
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          >
                            Edit Product
                          </Link>
                          <button
                            onClick={() => handleDeleteButton(product)}
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
            }
          )}
        </tbody>
      </table>
    );
  };

  const totalProductsCount = productsCountData?.data?.count ?? 0;

  return (
    <PageTemplate title="All Products">
      <div className="flex w-full justify-end mb-4">
        <Link
          className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-500"
          to="add"
        >
          Add Product
        </Link>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm">
          <h2 className="text-gray-800 font-semibold text-md">
            All
            <span className="text-gray-400 font-semibold text-sm">
              {" "}
              {totalProductsCount}
            </span>
          </h2>
        </div>
        <div className="w-full md:w-3/5 lg:w-1/2 mt-4 md:mt-0">
          <SearchInput onChange={handleInputChange} ref={inputRef} />
        </div>
      </div>
      {renderTableOrMessage()}
    </PageTemplate>
  );
}

export default ManageProducts;
