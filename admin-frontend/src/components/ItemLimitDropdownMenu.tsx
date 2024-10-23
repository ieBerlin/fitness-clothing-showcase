import { ChevronDoubleDownIcon } from "@heroicons/react/24/solid";
import DropdownMenu from "./DropdownMenu";
import { ExtendedFilterParams } from "../utils/http";
import { paginationOptions } from "../constants/dropdownOptions";

const ItemLimitDropdownMenu = <T,>({
  params,
  updateFilterParams,
}: {
  params: ExtendedFilterParams<T>;
  updateFilterParams: <K extends keyof ExtendedFilterParams<T>>(
    paramKey: K,
    paramValue: ExtendedFilterParams<T>[K]
  ) => void;
}) => {
  const label = (
    <div className="flex items-center gap-2 px-3 py-2 border bg-gray-50 text-gray-800">
      <span className="text-lg font-semibold">Showing</span>
      <ChevronDoubleDownIcon className="w-4 h-4 text-gray-600" />
    </div>
  );

  const content = (
    <div className="bg-[#171717] border border-gray-200 p-4">
      <label className="block font-semibold text-sm text-white">Showing</label>
      <ul className="space-y-1 mt-2">
        {paginationOptions.map((option) => (
          <li
            key={option}
            className={`cursor-pointer px-2 py-1 ${
              params.itemLimit === option
                ? "bg-[#212121]"
                : "hover:bg-[#212121]"
            } transition-colors duration-200 ease-in-out`}
            onClick={() => updateFilterParams("itemLimit", option)}
          >
            <span className="text-white font-medium">{option}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return <DropdownMenu label={label} content={content} />;
};

export default ItemLimitDropdownMenu;
