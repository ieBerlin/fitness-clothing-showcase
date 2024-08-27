import { ReactNode, useEffect, useRef, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import SearchInput from "../components/SearchInput";
import LoadingSpinner from "../components/LoadingSpinner";
import StyledAvailability from "../components/StyledAvailability";
import { debounce } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { Availability, ErrorResponse, Product } from "../types/product.types";
import DropdownMenu from "../components/DropdownMenu";
import { openModal } from "../features/modal";
import { useDispatch } from "react-redux";
import { ModalType } from "../types/modal.types";
import { Link } from "react-router-dom";
import { fetchProducts } from "../utils/authUtils";
import ErrorDisplay from "../components/ErrorDisplay";
import { queryClient } from "../utils/http";

function ManageProducts() {
  const pageRef = useRef<number>(1);
  const [productsState, setProductsState] = useState<{
    products: Product[];
    args: string;
  }>({
    products: [],
    args: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const {
    isFetching: isProductsLoading,
    isError: hasProductsError,
    data: productsData,
    error: productsErrors,
  } = useQuery({
    queryKey: ["products", productsState.args],
    queryFn: () =>
      fetchProducts({
        page: pageRef.current ?? 1,
        search: inputRef?.current?.value,
      }),
    staleTime: Infinity,
  });
  const isLoading = isProductsLoading;
  const hasError = hasProductsError;
  useEffect(() => {
    if (productsData?.success && productsData.data.products) {
      setProductsState((prevState) => {
        const currentArgs = inputRef.current?.value ?? "";
        const prevArgs = prevState.args;

        const prevProducts = prevState.products;
        const newProducts = (productsData.data.products as Product[]).filter(
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
        pageRef.current = prevArgs === currentArgs ? pageRef.current : 1;
        return {
          products: updatedProducts,
          args: currentArgs,
        };
      });
    }
  }, [productsData]);
  const handleDeleteProduct = (product: Product) => {
    dispatch(openModal({ type: ModalType.DELETE_PRODUCT, data: product }));
  };
  const handleInputChange = debounce(() => {
    queryClient.invalidateQueries({
      queryKey: ["products", productsState.args],
    });
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
      const errors: ErrorResponse = productsErrors as unknown as ErrorResponse;

      return (
        <div className="space-y-4">
          <ErrorDisplay error={errors} />
        </div>
      );
    }
    if (
      !productsData ||
      (productsData.success && productsData.data.products?.length === 0)
    ) {
      return (
        <div className="flex items-center justify-center w-full py-10">
          <h2 className="text-gray-600 font-semibold">No Products Found</h2>
        </div>
      );
    }
    function handleShowMoreItems() {
      const totalPages = productsData?.data.totalPages;
      const currentPage = productsData?.data.currentPage;
      if (totalPages && currentPage && totalPages > currentPage) {
        pageRef.current++;
        setProductsState((prevState) => ({
          ...prevState,
        }));
        queryClient.invalidateQueries({
          queryKey: ["products", inputRef.current?.value || ""],
        });
      }
    }
    const isShowMoreVisible = productsData?.data.totalProducts
      ? productsData.data.totalProducts > productsState.products.length
      : 0;
    return (
      <div>
        <ProductTable
          products={productsState.products}
          onDeleteProduct={handleDeleteProduct}
        />
        {isShowMoreVisible ? (
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
        )}
      </div>
    );
  };

  const totalProductsCount = productsData?.data?.totalProducts ?? 0;

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

function ProductTable({
  products,
  onDeleteProduct,
}: {
  products: Product[];
  onDeleteProduct: (product: Product) => void;
}) {
  return (
    <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-md">
      <thead className="bg-gray-50">
        <tr>
          {["Product Name", "Price", "Availability", "Colors", "Actions"].map(
            (header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {header}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {products.map((product) => {
          const { _id, productName, price, availability, colors } = product;
          return (
            <tr key={_id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                {productName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                ${price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                <StyledAvailability status={availability as Availability} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                {colors.map((color) => color.name).join(", ")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                <DropdownMenu
                  position="top-1 right-1"
                  label={
                    <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors" />
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
                        onClick={() => onDeleteProduct(product)}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-800 w-full text-left"
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
}
