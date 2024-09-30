import { ReactNode } from "react";

interface UsableTableProps<T> {
  tableHeadItems: string[];
  data: T[];
  isLoading: boolean;
  renderContent: (data: { item: T; index: number }) => ReactNode;
  emptyMessage?: string;
  loadingMessage?: string;
  loadingIcon?: ReactNode;
}

const UsableTable = <T,>({
  tableHeadItems,
  data,
  isLoading,
  renderContent,
  emptyMessage = "No data available.",
  loadingMessage = "Loading...",
  loadingIcon,
}: UsableTableProps<T>) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 bg-white">
      <thead className="bg-gray-50">
        <tr>
          {tableHeadItems.map((header, index) => (
            <th
              key={index}
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {isLoading ? (
          <tr>
            <td
              colSpan={tableHeadItems.length}
              className="px-6 py-4 text-center text-sm font-medium text-gray-600"
            >
              <div className="flex justify-center items-center space-x-2">
                {loadingIcon ? (
                  loadingIcon
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-400 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                )}
                <span>{loadingMessage}</span>
              </div>
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td
              colSpan={tableHeadItems.length}
              className="px-6 py-4 text-center text-sm font-medium text-gray-600"
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((item, index) => renderContent({ item, index }))
        )}
      </tbody>
    </table>
  );
};

export default UsableTable;
