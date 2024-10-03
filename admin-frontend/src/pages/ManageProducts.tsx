import { useCallback, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import { Link } from "react-router-dom";
import DropdownMenu from "../components/DropdownMenu";
import DataTable from "../components/DataTable";
import { openModal } from "../features/modal";
import Product from "../models/Product";
import { useDispatch } from "react-redux";
import { ModalType } from "../enums/ModalType";
import { fetchProducts } from "../utils/authUtils";
import UsableTable from "../components/UsableTable";
import DropdownFilterGroup from "../components/FilterDropdownMenus";
import SearchBar from "../components/SearchBar";
import { ExtendedFilterParams } from "../utils/http";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { productsQuantity } from "../utils/func";
import StyledAvailability from "../components/StyledAvailability";
import { productQueryKey } from "../constants/queryKeys";
import {
  defaultFilterParams,
  ProductFilterParams,
} from "../types/productFilters";
import PriceFilterDropdown from "../components/PriceFilterDropdown";

function ManageProducts() {
  const [params, setParams] =
    useState<ExtendedFilterParams<typeof defaultFilterParams>>(
      defaultFilterParams
    );
  const dispatch = useDispatch();

  const handleDeleteProduct = (product: Product) => {
    dispatch(openModal({ type: ModalType.DELETE_PRODUCT, data: product }));
  };

  const handleUpdateArgs = useCallback(
    (params: ExtendedFilterParams<ProductFilterParams>) => {
      setParams(params);
    },
    []
  );

  return (
    <PageTemplate title="Manage Products">
      <div className="mb-6 flex space-x-4">
        <DataTable<Product, ProductFilterParams>
          key="manage-products-data-table"
          updateParams={handleUpdateArgs}
          fetchDataParams={params}
          initialParams={params}
          queryKey={productQueryKey}
          fetchItems={fetchProducts}
          renderTableContent={({ updateFilterParams, dataEntries }) => ({
            ContentRenderer: ({ loading }) => (
              <UsableTable<Product>
                isLoading={loading}
                data={dataEntries}
                tableHeadItems={[
                  "Count",
                  "Product Name",
                  "Price",
                  "Availability",
                  "Quantity",
                  "Actions",
                ]}
                renderContent={({ item: product, index }) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 border-b border-gray-200">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                      <Link
                        to={`/products/${product._id}`}
                        className="block text-gray-800"
                      >
                        <div className="text-sm font-medium">
                          {product.productName}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                      <Link
                        to={`/products/${product._id}`}
                        className="block text-gray-600"
                      >
                        <div className="text-sm font-medium">
                          ${product.price.toFixed(2)}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                      <Link
                        to={`/products/${product._id}`}
                        className="block text-gray-600"
                      >
                        <div className="text-sm font-medium">
                          <StyledAvailability status={product.availability} />
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                      <Link
                        to={`/products/${product._id}`}
                        className="block text-gray-600"
                      >
                        <div className="text-sm font-medium">
                          {productsQuantity(product)}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                      <DropdownMenu
                        position="top-1 right-1"
                        label={
                          <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors" />
                        }
                        content={
                          <div className="bg-white shadow-lg rounded-md">
                            <Link
                              to={`/products/${product._id}/edit`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
                            >
                              Edit Product
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product)}
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-800 w-full text-left rounded-md transition-colors"
                            >
                              Delete Product
                            </button>
                          </div>
                        }
                      />
                    </td>
                  </tr>
                )}
              />
            ),
            dropDownMenus: (
              <DropdownFilterGroup
                searchDropDownMenu={
                  <SearchBar
                    onChange={(e) =>
                      updateFilterParams("searchTerm", e.target.value)
                    }
                  />
                }
                dropDownMenus={PriceFilterDropdown({
                  updateFilterParams,
                  params,
                }).concat(
                  <Link
                    className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-500"
                    to="add"
                  >
                    Add Product
                  </Link>
                )}
              />
            ),
          })}
        />
      </div>
    </PageTemplate>
  );
}

export default ManageProducts;
