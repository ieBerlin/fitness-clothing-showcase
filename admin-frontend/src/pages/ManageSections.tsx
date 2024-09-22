import { useCallback, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import {
  ArrowUpOnSquareIcon,
  ChevronDoubleDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import DropdownMenu from "../components/DropdownMenu";
import ProductTable from "../components/ProductsTable";
import { useDispatch } from "react-redux";
import { openModal } from "../features/modal";
import { ExtendedFilterParams, queryClient } from "../utils/http";
import Product from "../models/Product";
import Section from "../models/Section";
import { ModalType } from "../enums/ModalType";
import PriceOptions from "../enums/PriceOptions";
import Availability from "../enums/Availability";
import FilterMenu from "../components/FilterMenu";
import RadioGroup from "../components/RadioGroup";
import ExcelExport from "../components/ExcelExport";
import DataTable from "../components/DataTable";
import { fetchSections } from "../utils/authUtils";
import { SectionResponseItem } from "../types/response";
import DropdownFilterGroup from "../components/FilterDropdownMenus";
import SearchBar from "../components/SearchBar";
const options = [10, 20, 50, 100];
const availabilityOptions = Object.values(Availability).map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " "),
  value,
}));
const priceOptions = Object.values(PriceOptions).map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " "),
  value,
}));

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

const sectionQueryKey = ["sections"];
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
          section: activeSection?.items,
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
          updateParams={handleUpdateArgs}
          fetchDataParams={params}
          initialParams={params}
          queryKey={sectionQueryKey}
          fetchItems={fetchSections}
          renderTableContent={({
            updateFilterParams,
            dataEntries: sections,
          }) => ({
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
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">Showing</span>
                      <DropdownMenu
                        label={
                          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-100 text-gray-800">
                            <span className="text-lg font-medium">
                              {params.itemLimit}
                            </span>
                            <ChevronDoubleDownIcon className="w-4 h-4 text-gray-600" />
                          </div>
                        }
                        content={
                          <ul className="space-y-2">
                            {options.map((option) => (
                              <li
                                key={option}
                                className="cursor-pointer hover:bg-gray-200 active:bg-gray-300 px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out"
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
                      onSubmit={() => {
                        queryClient.invalidateQueries({
                          queryKey: sectionQueryKey,
                        });
                      }}
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
                            options={priceOptions}
                            name={"price"}
                            selectedValue={params.price}
                          />
                        </div>
                      }
                    />,
                    <DropdownMenu
                      closeOnContentClick={false}
                      onSubmit={() => {
                        queryClient.invalidateQueries({
                          queryKey: ["products"],
                        });
                      }}
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
                            className="feather feather-dollar-sign w-5 h-5 text-gray-600"
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
                          options={availabilityOptions}
                          onCheck={(updatedValues) =>
                            updateFilterParams(
                              "availability",
                              updatedValues as Availability[]
                            )
                          }
                          defaultCheckedValues={params.availability}
                        />
                      }
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
                                sections.map((section) => section.products) ||
                                [],
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
                    <ProductTable
                      isLoading={loading}
                      products={
                        sections?.find(
                          (section) =>
                            section.section.name === activeSection?.name
                        )?.products.items ||
                        [] ||
                        []
                      }
                      actionsDropDownMenuContent={(product) => (
                        <button
                          onClick={() => handleRemoveProduct(product)}
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-800 w-full text-left"
                        >
                          Remove Product
                        </button>
                      )}
                    />
                  </div>
                )}
              </div>
            ),
          })}
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
