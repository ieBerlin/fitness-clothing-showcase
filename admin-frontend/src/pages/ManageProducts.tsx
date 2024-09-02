import { ReactNode, useEffect, useRef, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import SearchInput from "../components/SearchInput";
import LoadingSpinner from "../components/LoadingSpinner";
import { debounce } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { openModal } from "../features/modal";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../utils/authUtils";
import ErrorDisplay from "../components/ErrorDisplay";
import { queryClient } from "../utils/http";
import ProductTable from "../components/ProductsTable";
import Product from "../models/Product";
import { ModalType } from "../enums/ModalType";
import { ErrorResponse, ProductsResponse } from "../types/response";
import DropdownMenu from "../components/DropdownMenu";
import { ChevronDoubleDownIcon, FunnelIcon } from "@heroicons/react/24/outline";
import FilterMenu from "../components/FilterMenu";
import { CheckboxOption } from "../components/CheckboxGroup";
export const priceOptions: CheckboxOption[] = [
  { value: "less_than_5000", label: "Less than 5000 DZD" },
  { value: "5000_to_10000", label: "5000 - 10,000 DZD" },
  { value: "over_10000", label: "Over 10,000 DZD" },
];
export const availabilityOptions: CheckboxOption[] = [
  { value: "in_stock", label: "In Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "discounted", label: "Discounted" },
  { value: "coming_soon", label: "Coming Soon" },
  { value: "out_of_season", label: "Out of Season" },
  { value: "unavailable", label: "Unavailable" },
];
const options = [10, 20, 50, 100];
function ManageProducts() {
  const [selectedValues, setSelectedValues] = useState<{
    availability: string[];
    price: string[];
  }>({ availability: [], price: [] });
  const handleValuesChange = (updatedValues: string[], key: string) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [key]: updatedValues,
    }));
  };
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [filterArgs, setFilterArgs] = useState<{
    limit: number;
    page: number;
    search?: string;
  }>({
    limit: 10,
    page: 1,
    search: "",
  });
  const [productsState, setProductsState] = useState<{
    products: Product[];
    args: string;
  }>({
    products: [],
    args: "",
  });
  const dispatch = useDispatch();

  const {
    isFetching: isProductsLoading,
    isError: hasProductsError,
    data: productsData,
    error: productsErrors,
  } = useQuery<ProductsResponse, ErrorResponse>({
    queryKey: ["products"],
    queryFn: () =>
      fetchProducts({
        ...filterArgs,
        ...selectedValues,
      }),
  });
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["products"],
    });
  }, [filterArgs]);
  useEffect(() => {
    if (productsData && productsData.products) {
      setProductsState((prevState) => {
        const currentArgs = filterArgs.search ?? "";
        const prevArgs = prevState.args;

        const prevProducts = prevState.products;
        const newProducts = (productsData.products as Product[]).filter(
          (product) => !prevProducts.some((pro) => pro._id === product._id)
        );

        const updatedProducts =
          prevArgs === currentArgs
            ? [...prevProducts, ...newProducts]
            : newProducts;

        updatedProducts.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );
        return {
          products: updatedProducts,
          args: currentArgs,
        };
      });
    }
  }, [filterArgs.search, productsData]);
  const isLoading = isProductsLoading;
  const hasError = hasProductsError;

  const isShowMoreVisible = productsData?.totalProducts
    ? productsData.totalProducts > productsState.products.length
    : 0;
  const totalProductsCount = productsData?.totalProducts ?? 0;
  const handleDeleteProduct = (product: Product) => {
    dispatch(openModal({ type: ModalType.DELETE_PRODUCT, data: product }));
  };
  const handleInputChange = debounce(() => {
    setFilterArgs((prevArgs) => ({
      ...prevArgs,
      search: searchRef.current?.value ?? "",
    }));
    queryClient.invalidateQueries({
      queryKey: ["products"],
    });
  }, 300);
  function handleShowMoreItems() {
    const totalPages = productsData?.totalPages;
    const currentPage = productsData?.currentPage;
    if (totalPages && currentPage && totalPages > currentPage) {
      setFilterArgs((prevArgs) => ({
        ...prevArgs,
        page: prevArgs.page + 1,
      }));
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    }
  }
  function handleShowingOptionChange(option: number) {
    setFilterArgs((prevArgs) => ({ ...prevArgs, page: 1, limit: option }));
  }

  const renderTableOrMessage = (): ReactNode => {
    if (isLoading && !productsData?.products?.length) {
      return (
        <div className="flex items-center justify-center w-full py-10 flex-col gap-2">
          <LoadingSpinner fill="blue-600" text="gray-400" dimension="16" />
          <h2 className="text-gray-500 font-semibold">Loading...</h2>
        </div>
      );
    }

    if (hasError) {
      const errors: ErrorResponse = productsErrors as unknown as ErrorResponse;

      return (
        <div className="space-y-4">
          <ErrorDisplay error={errors} />
        </div>
      );
    }
    if (
      !productsData ||
      (productsData && productsData.products?.length === 0)
    ) {
      return (
        <div className="flex items-center justify-center w-full py-10">
          <h2 className="text-gray-600 font-semibold">No Products Found</h2>
        </div>
      );
    }

    return (
      <div>
        <ProductTable
          isLoading={isLoading}
          products={productsState.products}
          actionsDropDownMenuContent={(product) => (
            <div>
              <Link
                to={`/products/${product._id}/edit`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Edit Product
              </Link>
              <button
                onClick={() => handleDeleteProduct(product)}
                className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-800 w-full text-left"
              >
                Delete Product
              </button>
            </div>
          )}
        />
        {!isLoading &&
          (isShowMoreVisible ? (
            <div className="mt-4 text-center">
              <button
                onClick={handleShowMoreItems}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors"
              >
                Show More
              </button>
            </div>
          ) : (
            <div className="mt-4 text-center">
              <h2 className="text-gray-600 font-semibold text-sm">
                End Of Results
              </h2>
            </div>
          ))}
      </div>
    );
  };

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
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-gray-800 font-semibold text-lg">
              All
              <span className="text-gray-500 font-medium text-sm ml-2">
                {totalProductsCount}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Showing</span>
            <DropdownMenu
              label={
                <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-50 text-gray-800 shadow-sm">
                  <span className="text-lg font-semibold">
                    {filterArgs.limit}
                  </span>
                  <ChevronDoubleDownIcon className="w-4 h-4 text-gray-600" />
                </div>
              }
              content={
                <ul className="space-y-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {options.map((option) => (
                    <li
                      key={option}
                      className="cursor-pointer hover:bg-gray-100 active:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out"
                      onClick={() => handleShowingOptionChange(option)}
                    >
                      <span className="text-gray-800 font-medium">
                        {option}
                      </span>
                    </li>
                  ))}
                </ul>
              }
            />
          </div>
          <DropdownMenu
            onSubmit={() => {
              queryClient.invalidateQueries({
                queryKey: ["products"],
              });
            }}
            closeOnContentClick={false}
            label={
              <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-100 text-gray-800">
                <span className="font-medium">Price</span>
                <FunnelIcon className="w-5 h-5 text-gray-600" />
              </div>
            }
            content={
              <FilterMenu
                label="Prices"
                name="prices"
                options={priceOptions}
                onCheck={(updatedValues) =>
                  handleValuesChange(updatedValues, "price")
                }
                defaultCheckedValues={selectedValues.price}
              />
            }
          />
          <DropdownMenu
            closeOnContentClick={false}
            onSubmit={() => {
              queryClient.invalidateQueries({
                queryKey: ["products"],
              });
            }}
            label={
              <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-100 text-gray-800">
                <span className="font-medium">Availability</span>
                <FunnelIcon className="w-5 h-5 text-gray-600" />
              </div>
            }
            content={
              <FilterMenu
                label="Availability"
                name="availability"
                options={availabilityOptions}
                onCheck={(updatedValues) =>
                  handleValuesChange(updatedValues, "availability")
                }
                defaultCheckedValues={selectedValues.availability}
              />
            }
          />
        </div>
        <div className="w-full md:w-3/5 lg:w-1/2">
          <SearchInput onChange={handleInputChange} ref={searchRef} />
        </div>
      </div>

      {renderTableOrMessage()}
    </PageTemplate>
  );
}

export default ManageProducts;
