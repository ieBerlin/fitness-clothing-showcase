import { useCallback, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import {
  ArrowUpOnSquareIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import DropdownMenu from "../components/DropdownMenu";
import UsableTable from "../components/UsableTable";
import { useDispatch } from "react-redux";
import { openModal } from "../features/modal";
import { ExtendedFilterParams } from "../utils/http";
import Product from "../models/Product";
import Section from "../models/Section";
import { ModalType } from "../enums/ModalType";
import ExcelExport from "../components/ExcelExport";
import DataTable from "../components/DataTable";
import { fetchSections } from "../utils/authUtils";
import { SectionResponseItem } from "../types/response";
import DropdownFilterGroup from "../components/FilterDropdownMenus";
import SearchBar from "../components/SearchBar";
import { productsQuantity } from "../utils/func";
import StyledAvailability from "../components/StyledAvailability";
import { sectionQueryKey } from "../constants/queryKeys";
import {
  defaultFilterParams,
  ProductFilterParams,
} from "../types/productFilters";
import PriceFilterDropdown from "../components/PriceFilterDropdown";

function ManageSections() {
  const [params, setParams] =
    useState<ExtendedFilterParams<typeof defaultFilterParams>>(
      defaultFilterParams
    );
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const dispatch = useDispatch();

  const handleSectionChange = useCallback(
    (section: Section) => setActiveSection(section),
    []
  );

  function handleRemoveProduct(product: Product) {
    dispatch(
      openModal({
        type: ModalType.REMOVE_PRODUCT_TO_SECTION,
        data: {
          product,
          section: activeSection,
        },
      })
    );
  }

  const handleUpdateArgs = useCallback(
    (params: ExtendedFilterParams<ProductFilterParams>) => {
      setParams(params);
    },
    []
  );

  return (
    <PageTemplate title="Section Management">
      <div className="flex flex-col p-6 space-y-6">
        <DataTable<SectionResponseItem, ProductFilterParams>
          isDataMerged={false}
          updateParams={handleUpdateArgs}
          fetchDataParams={params}
          initialParams={params}
          queryKey={sectionQueryKey}
          fetchItems={fetchSections}
          renderTableContent={({
            updateFilterParams,
            dataEntries: sections,
          }) => {
            if (sections.length && !activeSection) {
              handleSectionChange(sections[0].section);
            }
            return {
              ContentRenderer: ({ loading }) => (
                <div className="flex flex-col w-full gap-2">
                  <SectionList
                    sections={sections.map((section) => section.section)}
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                  />
                  {/* drop down menus */}
                  <DropdownFilterGroup
                    searchDropDownMenu={
                      <SearchBar
                        onChange={(e) =>
                          updateFilterParams("searchTerm", e.target.value)
                        }
                      />
                    }
                    dropDownMenus={[
                      <PriceFilterDropdown
                        updateFilterParams={updateFilterParams}
                        params={params}
                      />,
                      <ExcelExport
                        data={sections.map((section) => section.products) || []}
                        fileName={(activeSection?.name ?? "section")
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, "")}
                      >
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
                          <ArrowUpOnSquareIcon className="w-5 h-5" />
                          <span className="font-medium">Export</span>
                        </button>
                      </ExcelExport>,
                      <button
                        onClick={() => {
                          dispatch(
                            openModal({
                              type: "add-product-to-section",
                              data: {
                                sectionId: activeSection?._id,
                                items:
                                  sections.find(
                                    (section) =>
                                      section.section._id === activeSection?._id
                                  )?.products.items || [],
                              },
                            })
                          );
                          // handleAddProductToASection();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <PlusIcon className="w-5 h-5" />
                        <span className="font-medium">Add New Products</span>
                      </button>,
                    ]}
                  />

                  {activeSection && (
                    <div className="bg-white shadow-lg">
                      <UsableTable<Product>
                        isLoading={loading}
                        data={
                          sections?.find(
                            (section) =>
                              section.section.name === activeSection?.name
                          )?.products.items ||
                          [] ||
                          []
                        }
                        tableHeadItems={[
                          "count",
                          "Product Name",
                          "Price",
                          "Availability",
                          "Quantity",
                          "Actions",
                        ]}
                        renderContent={({ item: product, index }) => (
                          <tr
                            key={product._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              {product.productName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                              ${product.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                              <StyledAvailability
                                status={product.availability}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                              {productsQuantity(product)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                              <DropdownMenu
                                position="top-1 right-1"
                                label={
                                  <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors" />
                                }
                                content={
                                  <button
                                    onClick={() => handleRemoveProduct(product)}
                                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-800 w-full text-left"
                                  >
                                    Remove Product
                                  </button>
                                }
                              />
                            </td>
                          </tr>
                        )}
                      />
                    </div>
                  )}
                </div>
              ),
            };
          }}
        />
      </div>
    </PageTemplate>
  );
}

export default ManageSections;

interface SectionListProps {
  sections: Section[];
  activeSection: Section | null;
  onSectionChange: (section: Section) => void;
}

const SectionList: React.FC<SectionListProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  return (
    <div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((section) => (
          <li
            key={section._id}
            className={`transition-transform duration-300 ease-in-out ${
              activeSection?._id === section._id ? "transform scale-105" : ""
            }`}
          >
            <button
              onClick={() => onSectionChange(section)}
              className={`w-full p-4 rounded-lg border border-gray-300 shadow-lg ${
                activeSection?._id === section._id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800"
              } hover:bg-blue-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <div className="flex items-center justify-center h-full">
                <h2 className="text-lg font-semibold">{section.name}</h2>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
