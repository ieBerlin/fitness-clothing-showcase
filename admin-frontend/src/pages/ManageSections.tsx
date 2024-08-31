import { useEffect, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import {
  ArrowUpOnSquareIcon,
  ChevronDoubleDownIcon,
  FunnelIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import DropdownMenu from "../components/DropdownMenu";
import ProductTable from "../components/ProductsTable";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchSections, removeProductFromSection } from "../utils/authUtils";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";
import { useDispatch } from "react-redux";
import { openModal } from "../features/modal";
import { queryClient } from "../utils/http";
import Product from "../models/Product";
import Section from "../models/Section";
import {
  ErrorResponse,
  SectionResponse,
  SectionsResponse,
} from "../types/response";

function ManageSections() {
  const {
    isFetching,
    isError,
    data: sections,
    error: sectionsErrors,
  } = useQuery<SectionsResponse, ErrorResponse>({
    queryKey: ["sections"],
    queryFn: fetchSections,
    staleTime: Infinity,
  });
  const [showing, setShowing] = useState(10);
  // const options = [10, 20, 50, 100];
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  useEffect(() => {
    if (sections?.length) {
      setActiveSection(sections[0].section);
    }
  }, [sections]);
  const handleSectionChange = (section: Section) => setActiveSection(section);
  if (isFetching) {
    return (
      <div className="flex items-center justify-center w-full py-10 flex-col gap-2">
        <LoadingSpinner fill="blue-600" text="gray-400" dimension="16" />
        <h2 className="text-gray-500 font-semibold">Loading...</h2>
      </div>
    );
  }

  if (isFetching) {
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
          sections={sections?.map((item) => item.section) || []}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        {/* Active Section Details */}
        <ActiveSectionDetails
          products={
            sections?.find(
              (section) => section.section.name === activeSection?.name
            )?.products || []
          }
          section={activeSection}
          showing={showing}
          onShowingChange={setShowing}
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

interface ActiveSectionDetailsProps {
  section: Section | null;
  showing: number;
  products: Product[];
  onShowingChange: (showing: number) => void;
}

interface ShowingDropdownProps {
  showing: number;
  options: number[];
  onChange: (option: number) => void;
}

interface CheckboxProps {
  label: string;
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

const ActiveSectionDetails: React.FC<ActiveSectionDetailsProps> = ({
  products,
  section,
  showing,
  onShowingChange,
}) => {
  const {
    mutate,
    isPending: isLoading,
    isError,
    error,
  } = useMutation<
    SectionResponse,
    ErrorResponse,
    { sectionId: string; productId: string }
  >({
    mutationKey: ["sections", `sections-${section?.name}`],
    mutationFn: removeProductFromSection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sections"],
      });
    },
  });
  const options = [10, 20, 50, 100];
  function handleRemoveProduct(product: Product) {
    if (section) {
      mutate({ sectionId: section?._id, productId: product._id });
    }
  }
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-300">
      <h2 className="text-gray-800 font-semibold text-2xl mb-4">
        {section?.name} Products
      </h2>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <ShowingDropdown
          showing={showing}
          options={options}
          onChange={onShowingChange}
        />
        <ActionsMenu
          sectionId={section?._id}
          defaultProducts={products || []}
        />
      </div>
      {section && (
        <ProductTable
          products={products || []}
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

const ActionsMenu: React.FC<{
  sectionId?: string;
  defaultProducts: Product[];
}> = ({ defaultProducts, sectionId }) => {
  const dispatch = useDispatch();
  return (
    <div className="flex gap-2">
      <DropdownMenu
        label={
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-100 text-gray-800">
            <span className="font-medium">Filter</span>
            <FunnelIcon className="w-5 h-5 text-gray-600" />
          </div>
        }
        content={<FilterMenu />}
      />
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
        <ArrowUpOnSquareIcon className="w-5 h-5" />
        <span className="font-medium">Export</span>
      </button>
      <button
        onClick={() => {
          dispatch(
            openModal({
              type: "add-product-to-section",
              data: {
                sectionId,
                items: defaultProducts,
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
    </div>
  );
};

const FilterMenu: React.FC = () => {
  return (
    <div className="p-4 bg-white border rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Filter Options</h3>
      <div className="space-y-4">
        <PriceFilter />
        <AvailabilityFilter />
        <QuantityFilter />
      </div>
    </div>
  );
};

const PriceFilter: React.FC = () => {
  return (
    <div>
      <h4 className="font-medium mb-2">Price</h4>
      <div className="flex flex-col space-y-2">
        <Checkbox label="Under $50" />
        <Checkbox label="$50 - $100" />
        <Checkbox label="Over $100" />
      </div>
    </div>
  );
};

const AvailabilityFilter: React.FC = () => {
  return (
    <div>
      <h4 className="font-medium mb-2">Availability</h4>
      <div className="flex flex-col space-y-2">
        <Checkbox label="In Stock" />
        <Checkbox label="Out of Stock" />
      </div>
    </div>
  );
};

const QuantityFilter: React.FC = () => {
  return (
    <div>
      <h4 className="font-medium mb-2">Quantity</h4>
      <div className="flex flex-col space-y-2">
        <Checkbox label="Low Quantity" />
        <Checkbox label="Medium Quantity" />
        <Checkbox label="High Quantity" />
      </div>
    </div>
  );
};

const Checkbox: React.FC<CheckboxProps> = ({ label }) => {
  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        className="form-checkbox text-blue-600 focus:ring-blue-500"
      />
      <span className="ml-2 text-gray-700">{label}</span>
    </label>
  );
};
