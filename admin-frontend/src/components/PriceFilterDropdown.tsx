// FiltersDropdown.tsx
import DropdownMenu from "../components/DropdownMenu";
import { ExtendedFilterParams, queryClient } from "../utils/http";
import RadioGroup from "../components/RadioGroup";
import FilterMenu from "../components/FilterMenu";
import PriceOptions from "../enums/PriceOptions";
import Availability from "../enums/Availability";
import { sectionQueryKey } from "../constants/queryKeys";
import {
  formattedPriceOptions,
  formattedAvailabilityOptions,
  paginationOptions,
} from "../constants/dropdownOptions";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import { ProductFilterParams } from "../types/productFilters";

interface FiltersDropdownProps {
  updateFilterParams: <
    K extends keyof ExtendedFilterParams<ProductFilterParams>
  >(
    paramKey: K,
    paramValue: ExtendedFilterParams<ProductFilterParams>[K]
  ) => void;
  params: ExtendedFilterParams<ProductFilterParams>;
}

function FiltersDropdown({
  updateFilterParams,
  params,
}: FiltersDropdownProps): JSX.Element[] {
  return [
    <div className="flex items-center gap-4">
      <span className="text-gray-600 font-medium">Showing</span>
      <DropdownMenu
        label={
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-100 text-gray-800 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <span className="text-lg font-medium">{params.itemLimit}</span>
            <ChevronDoubleDownIcon className="w-4 h-4 text-gray-600" />
          </div>
        }
        content={
          <ul className="space-y-2">
            {paginationOptions.map((option) => (
              <li
                key={option}
                className="cursor-pointer hover:bg-gray-200 active:bg-gray-300 px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out"
                onClick={() => updateFilterParams("itemLimit", option)}
              >
                <span className="text-gray-800 font-medium">{option}</span>
              </li>
            ))}
          </ul>
        }
      />
    </div>,
    <DropdownMenu
      closeOnContentClick={false}
      onSubmit={() => {
        queryClient.invalidateQueries({ queryKey: sectionQueryKey });
      }}
      label={
        <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-100 text-gray-800 shadow-sm transition-shadow duration-200 hover:shadow-md">
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
              updateFilterParams("price", e.target.value as PriceOptions)
            }
            options={formattedPriceOptions}
            name={"price"}
            selectedValue={params.price}
          />
        </div>
      }
    />,
    <DropdownMenu
      closeOnContentClick={false}
      onSubmit={() => {
        queryClient.invalidateQueries({ queryKey: sectionQueryKey });
      }}
      label={
        <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-100 text-gray-800 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <span className="font-medium">Availability</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-check-circle w-5 h-5 text-gray-600"
          >
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c0 4.418-3.582 8-8 8S5 16.418 5 12s3.582-8 8-8 8 3.582 8 8z" />
          </svg>
        </div>
      }
      content={
        <FilterMenu
          label="Availability"
          name="availability"
          options={formattedAvailabilityOptions}
          onCheck={(updatedValues) =>
            updateFilterParams("availability", updatedValues as Availability[])
          }
          defaultCheckedValues={params.availability || []}
        />
      }
    />,
  ];
}

export default FiltersDropdown;
