import { useCallback, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import { Link } from "react-router-dom";
import DropdownMenu from "../components/DropdownMenu";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import FilterMenu from "../components/FilterMenu";
import RadioGroup from "../components/RadioGroup";
import Availability from "../enums/Availability";
import PriceOptions from "../enums/PriceOptions";
import DataTable from "../components/DataTable";
import { openModal } from "../features/modal";
import Product from "../models/Product";
import { useDispatch } from "react-redux";
import { ModalType } from "../enums/ModalType";
import { fetchProducts } from "../utils/authUtils";
import ProductTable from "../components/ProductsTable";
import DropdownFilterGroup from "../components/FilterDropdownMenus";
import SearchBar from "../components/SearchBar";
import { ExtendedFilterParams } from "../utils/http";
const itemLimitOptions = [10, 20, 50, 100];
const productListQueryKey = ["products"];

type ProductFilterParams = {
  availability: Availability[];
  price: PriceOptions;
};

const defaultFilterParams: ExtendedFilterParams<ProductFilterParams> = {
  currentPage: 1,
  searchTerm: "",
  itemLimit: 10,
  availability: Object.values(Availability) as Availability[],
  price: PriceOptions.ALL,
};

const formattedAvailabilityOptions = Object.values(Availability).map(
  (value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " "),
    value,
  })
);

const formattedPriceOptions = Object.values(PriceOptions).map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " "),
  value,
}));

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
          queryKey={productListQueryKey}
          fetchItems={fetchProducts}
          renderTableContent={({ updateFilterParams, dataEntries }) => ({
            ContentRenderer: ({ loading }) => (
              <ProductTable
                isLoading={loading}
                products={dataEntries}
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
                dropDownMenus={[
                  <div className="flex items-center gap-2" key="showing">
                    <span className="text-gray-600 font-medium">Showing</span>
                    <DropdownMenu
                      label={
                        <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-50 text-gray-800 shadow-sm">
                          <span className="text-lg font-semibold">
                            {params.itemLimit}
                          </span>
                          <ChevronDoubleDownIcon className="w-4 h-4 text-gray-600" />
                        </div>
                      }
                      content={
                        <ul className="space-y-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                          {itemLimitOptions.map((option) => (
                            <li
                              key={option}
                              className="cursor-pointer hover:bg-gray-100 active:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out"
                              onClick={() =>
                                updateFilterParams("itemLimit", option)
                              }
                            >
                              <span className="text-gray-800 font-medium">
                                {option}
                              </span>
                            </li>
                          ))}
                        </ul>
                      }
                    />
                  </div>,
                  <DropdownMenu
                    key="price"
                    closeOnContentClick={false}
                    label={
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-100 text-gray-800 shadow-sm">
                        <span className="font-medium">Price</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-dollar-sign w-5 h-5 text-gray-600"
                        >
                          <line x1="12" y1="1" x2="12" y2="23" />
                          <line x1="5" y1="8" x2="19" y2="8" />
                          <line x1="5" y1="16" x2="19" y2="16" />
                        </svg>
                      </div>
                    }
                    content={
                      <div className="flex flex-col space-y-2 p-2 text-gray-800">
                        <RadioGroup
                          classes="flex-col border-0"
                          label="Price"
                          onChange={(e) =>
                            updateFilterParams(
                              "price",
                              e.target.value as PriceOptions
                            )
                          }
                          options={formattedPriceOptions}
                          name="price"
                          selectedValue={params.price}
                        />
                      </div>
                    }
                  />,
                  <DropdownMenu
                    key="availability"
                    closeOnContentClick={false}
                    label={
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-100 text-gray-800 shadow-sm">
                        <span className="font-medium">Availability</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-check w-5 h-5 text-gray-600"
                        >
                          <path d="M12 20c4.418 0 8-3.582 8-8S16.418 4 12 4 4 7.582 4 12s3.582 8 8 8z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </div>
                    }
                    content={
                      <FilterMenu
                        label="Availability"
                        name="availability"
                        options={formattedAvailabilityOptions}
                        onCheck={(updatedValues) =>
                          updateFilterParams(
                            "availability",
                            updatedValues as Availability[]
                          )
                        }
                        defaultCheckedValues={params.availability || []}
                      />
                    }
                  />,
                  <Link
                    className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-500"
                    to="add"
                  >
                    Add Product
                  </Link>,
                ]}
              />
            ),
          })}
        />
      </div>
    </PageTemplate>
  );
}

export default ManageProducts;
