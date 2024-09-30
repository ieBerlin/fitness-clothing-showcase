import { QueryKey, useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { ExtendedFilterParams, queryClient } from "../utils/http";
import { isArray } from "lodash";
import ErrorAlert from "./ErrorAlert";
import LoadingSpinner from "./LoadingSpinner";
import { DataResponse, ErrorResponse } from "../types/response";

const DataTable = <T, ExtraParams>({
  isDataMerged = true,
  fetchDataParams,
  initialParams,
  queryKey,
  fetchItems,
  renderTableContent,
  updateParams,
}: {
  isDataMerged?: boolean;
  fetchItems: (
    params: ExtendedFilterParams<ExtraParams>
  ) => Promise<DataResponse<T>>;
  fetchDataParams: ExtendedFilterParams<ExtraParams>;
  initialParams: ExtendedFilterParams<ExtraParams>;
  updateParams: (params: ExtendedFilterParams<ExtraParams>) => void;
  renderTableContent: ({
    dataEntries,
    updateFilterParams,
  }: {
    dataEntries: T[];
    updateFilterParams: <K extends keyof ExtendedFilterParams<ExtraParams>>(
      paramKey: K,
      paramValue: ExtendedFilterParams<ExtraParams>[K]
    ) => void;
  }) => {
    ContentRenderer: ({
      loading,
      moreResultsVisible,
    }: {
      loading: boolean;
      moreResultsVisible: boolean;
    }) => ReactNode;
    dropDownMenus?: ReactNode;
  };
  queryKey: QueryKey;
}) => {
  const [dataEntries, setDataEntries] = useState<T[]>([]);
  const { isFetching, isError, data, error } = useQuery<
    DataResponse<T>,
    ErrorResponse
  >({
    queryKey,
    queryFn: () => fetchItems({ ...fetchDataParams }),
  });
  useEffect(() => {
    const newItems: T[] = isArray(data) ? data || [] : data?.items || [];
    setDataEntries((prevEntries) =>
      isDataMerged ? prevEntries.concat(newItems) : newItems
    );
  }, [data, fetchDataParams, isDataMerged, setDataEntries]);
  const moreResultsVisible =
    data?.currentPage !== data?.totalPages && data?.totalPages !== 0;

  function updateFilterParams<
    K extends keyof ExtendedFilterParams<ExtraParams>
  >(
    paramKey: K,
    paramValue: string | number | ExtendedFilterParams<ExtraParams>[K]
  ) {
    const newParams: typeof initialParams = {
      ...initialParams,
      [paramKey]: paramValue,
    };
    newParams.currentPage =
      paramKey === "currentPage" ? newParams.currentPage + 1 : 1;
    updateParams(newParams);
    if (paramKey !== "currentPage") {
      setDataEntries([]);
    }
    queryClient.removeQueries({ queryKey });
  }
  const { ContentRenderer, dropDownMenus: DropdownFilterGroup } =
    renderTableContent({
      updateFilterParams,
      dataEntries,
    });

  const renderTableDisplay = (): ReactNode => {
    if (
      isFetching &&
      (!data?.items?.length || (isArray(data) && !data.length))
    ) {
      return (
        <div className="flex items-center justify-center w-full py-10 flex-col gap-2">
          <LoadingSpinner fill="blue-600" text="gray-400" dimension="16" />
          <h2 className="text-gray-500 font-semibold">Loading...</h2>
        </div>
      );
    }

    if (isError) {
      const errorDetails: ErrorResponse = error as ErrorResponse;
      return (
        <div className="space-y-4">
          <ErrorAlert error={errorDetails} />
        </div>
      );
    }

    return (
      <ContentRenderer
        loading={isFetching}
        moreResultsVisible={moreResultsVisible}
      />
    );
  };

  return (
    <div className="flex flex-col w-full">
      {DropdownFilterGroup}
      {renderTableDisplay()}

      {!isFetching && (
        <div className="mt-6 flex justify-center items-center">
          {moreResultsVisible ? (
            <button
              onClick={() =>
                updateFilterParams("currentPage", initialParams.currentPage)
              }
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              Show More
            </button>
          ) : (
            <h2 className="text-gray-500 font-semibold text-base">
              End Of Results
            </h2>
          )}
        </div>
      )}
    </div>
  );
};

// const MemoizedDataTable = React.memo(DataTable);

// export default MemoizedDataTable;
export default DataTable;
