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
import { productQueryKey } from "../constants/queryKeys";
import {
  defaultFilterParams,
  ProductFilterParams,
} from "../types/productFilters";
import PriceFilterDropdown from "../components/PriceFilterDropdown";
import ProductTableRow from "../components/ProductTableRow";
import { productTableHeaders } from "../constants/tableHeaders";

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
      <div className="mb-6 flex space-x-4 h-full">
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
                tableHeadItems={productTableHeaders}
                renderContent={({ item, index }) => (
                  <ProductTableRow
                    key={item._id}
                    product={item}
                    count={index + 1}
                    actionsButtons={
                      <DropdownMenu
                        position="top-1 right-1"
                        label={
                          <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors" />
                        }
                        content={
                          <div className="bg-[#212121] ">
                            <Link
                              to={`/products/${item._id}/edit`}
                              className="block px-4 py-2 text-sm text-white hover:bg-blue-500 font-semibold transition-colors"
                            >
                              Edit Product
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(item)}
                              className="block px-4 py-2 text-sm text-white hover:bg-red-500 w-full text-left font-semibold transition-colors"
                            >
                              Delete Product
                            </button>
                          </div>
                        }
                      />
                    }
                  />
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
                    className="px-4 py-2 bg-gray-950 hover:bg-gray-800 text-white"
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
