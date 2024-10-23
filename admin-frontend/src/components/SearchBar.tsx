import { debounce } from "lodash";
import { ChangeEvent, ChangeEventHandler, forwardRef } from "react";

type SearchInputProps = {
  debouncingDuration?: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const SearchBar = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onChange, debouncingDuration = 600 }, ref) => {
    const handleSearchDebounce = debounce(
      (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event);
      },
      debouncingDuration
    );

    return (
      <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        onChange={handleSearchDebounce}
        ref={ref}
        type="search"
        className="block w-full px-4 py-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-sm bg-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition duration-300"
        placeholder="Search for anything ..."
        required
      />
    </div>
    
    );
  }
);

export default SearchBar;
