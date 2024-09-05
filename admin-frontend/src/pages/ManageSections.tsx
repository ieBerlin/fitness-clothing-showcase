import { useEffect, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import {
  ArrowUpOnSquareIcon,
  ChevronDoubleDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import DropdownMenu from "../components/DropdownMenu";
import ProductTable from "../components/ProductsTable";
import { useQuery } from "@tanstack/react-query";
import { fetchSections } from "../utils/authUtils";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";
import { useDispatch } from "react-redux";
import { openModal } from "../features/modal";
import { queryClient } from "../utils/http";
import Product from "../models/Product";
import Section from "../models/Section";
import { ErrorResponse, SectionsResponse } from "../types/response";
import { ModalType } from "../enums/ModalType";
import PriceOptions from "../enums/PriceOptions";
import Availability from "../enums/Availability";
import FilterMenu from "../components/FilterMenu";
import RadioGroup from "../components/RadioGroup";
import ExcelExport from "../components/ExcelExport";
const options = [10, 20, 50, 100];
const availabilityOptions = Object.values(Availability).map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " "),
  value,
}));
const priceOptions = Object.values(PriceOptions).map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " "),
  value,
}));
interface ShowingDropdownProps {
  showing: number;
  options: number[];
  onChange: (option: number) => void;
}

function ManageSections() {
  // const [sectionsState, setSectionsState] = useState<{
  //   data: {
  //     section: Section;
  //     products: Product[];
  //   }[];
  //   availability: Availability[];
  //   price: PriceOptions;
  // }>({
  //   data: [],
  //   availability: Object.values(Availability) as Availability[],
  //   price: PriceOptions.ALL,
  // });

  const [selectedValues, setSelectedValues] = useState<{
    availability: string[];
    price: string;
  }>({
    availability: Object.values(Availability),
    price: "all",
  });
  const handleValuesChange = (
    updatedValues: string[] | string,
    key: string
  ) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [key]: updatedValues,
    }));
  };
  const [filterArgs, setFilterArgs] = useState<{
    limit: number;
    page: number;
  }>({
    limit: 10,
    page: 1,
  });

  const {
    isFetching,
    isError,
    data: sections,
    error: sectionsErrors,
  } = useQuery<SectionsResponse, ErrorResponse>({
    queryKey: ["sections"],
    queryFn: () =>
      fetchSections({
        ...filterArgs,
        ...selectedValues,
      }),
  });

  const [activeSection, setActiveSection] = useState<Section | null>(null);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["sections"] });
  }, [filterArgs.limit]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (sections?.length) {
      setActiveSection((prevSection) => prevSection ?? sections[0].section);
    }
  }, [sections]);

  const handleSectionChange = (section: Section) => setActiveSection(section);
  function handleLimitChange(limit: number) {
    setFilterArgs((prevState) => ({ ...prevState, limit }));
  }
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
  if (isFetching && !sections?.length) {
    return (
      <div className="flex items-center justify-center w-full py-10 flex-col gap-2">
        <LoadingSpinner fill="blue-600" text="gray-400" dimension="16" />
        <h2 className="text-gray-500 font-semibold">Loading sections...</h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <ErrorDisplay error={sectionsErrors as ErrorResponse} />
      </div>
    );
  }

  if (!sections || !sections.length) {
    return (
      <div className="flex items-center justify-center w-full py-10">
        <h2 className="text-gray-600 font-semibold">No Sections Found</h2>
      </div>
    );
  }

  return (
    <PageTemplate title="Section Management">
      <div className="flex flex-col p-6 space-y-6">
        {/* Section List */}
        <SectionList
          sections={
            sections
              ?.map((item) => item.section)
              .sort((a, b) => a.name.localeCompare(b.name)) || []
          }
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-gray-800 font-semibold text-2xl mb-4">
            {activeSection?.name} Products
          </h2>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <ShowingDropdown
              showing={filterArgs.limit}
              options={options}
              onChange={handleLimitChange}
            />
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
            </ExcelExport>
            <button
              onClick={() => {
                dispatch(
                  openModal({
                    type: "add-product-to-section",
                    data: {
                      sectionId: activeSection?._id,
                      items: sections.map((section) => section.products) || [],
                    },
                  })
                );
                // handleAddProductToASection();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="font-medium">Add New Products</span>
            </button>
            <DropdownMenu
              onSubmit={() => {
                queryClient.invalidateQueries({
                  queryKey: ["products"],
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
                      handleValuesChange(e.target.value, "price")
                    }
                    options={priceOptions}
                    name={"price"}
                    selectedValue={selectedValues.price}
                  />
                </div>
              }
            />

            {/* Availability Dropdown */}
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
                    handleValuesChange(updatedValues, "availability")
                  }
                  defaultCheckedValues={selectedValues.availability}
                />
              }
            />
          </div>
          {activeSection && (
            <ProductTable
              isLoading={isFetching}
              products={
                sections?.find(
                  (section) => section.section.name === activeSection?.name
                )?.products ||
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
          )}
        </div>
        {/* Active Section Details */}
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

const ShowingDropdown: React.FC<ShowingDropdownProps> = ({
  showing,
  options,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-600 font-medium">Showing</span>
      <DropdownMenu
        label={
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-100 text-gray-800">
            <span className="text-lg font-medium">{showing}</span>
            <ChevronDoubleDownIcon className="w-4 h-4 text-gray-600" />
          </div>
        }
        content={
          <ul className="space-y-2">
            {options.map((option) => (
              <li
                key={option}
                className="cursor-pointer hover:bg-gray-200 active:bg-gray-300 px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out"
                onClick={() => onChange(option)}
              >
                <span className="text-gray-800 font-medium">{option}</span>
              </li>
            ))}
          </ul>
        }
      />
    </div>
  );
};
