import { ChangeEventHandler, forwardRef } from "react";

type SearchInputProps = {
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onChange }, ref) => {
    return (
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
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
          onChange={onChange}
          ref={ref}
          type="search"
          className="block w-full px-4 py-3 ps-10 text-sm text-gray-900 border border-gray-500 rounded-lg bg-gray-100 focus:border-blue-600"
          placeholder="Search for anything ..."
          required
        />
      </div>
    );
  }
);

export default SearchInput;
