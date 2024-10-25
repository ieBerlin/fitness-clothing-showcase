import { FC, useCallback, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import { fetchActivities } from "../utils/authUtils";
import { ExtendedFilterParams } from "../utils/http";
import Activity from "../models/Activity";
import DataTable from "../components/DataTable";
import { activityQueryKey } from "../constants/queryKeys";
import { getDateRanges } from "../constants/dropdownOptions";
import {
  ActivityFilterParams,
  defaultFilterParams,
} from "../types/activityFilters";
import AdminActivityDropdown from "../components/AdminActivityDropdown";
import ActivityLogItem from "../components/ActivityLogItem";

const AdminActivity: FC = () => {
  const [params, setParams] =
    useState<ExtendedFilterParams<ExtendedFilterParams<ActivityFilterParams>>>(
      defaultFilterParams
    );

  const handleUpdateArgs = useCallback(
    (params: ExtendedFilterParams<ActivityFilterParams>) => {
      setParams(params);
    },
    []
  );

  const fetchFilteringArgs = {
    ...params,
    startDate: getDateRanges(params.timing).start,
    endDate: getDateRanges(params.timing).end,
  };
  return (
    <PageTemplate title="Admin Activities">
      <DataTable<Activity, ActivityFilterParams>
        key="admin-activity-data-table"
        updateParams={handleUpdateArgs}
        fetchDataParams={fetchFilteringArgs}
        initialParams={params}
        queryKey={activityQueryKey}
        fetchItems={fetchActivities}
        renderTableContent={({ updateFilterParams, dataEntries: items }) => ({
          ContentRenderer: () => (
            <ul className="space-y-6">
              {items.map((item) => (
                <ActivityLogItem activityItem={item} key={item._id} />
              ))}
            </ul>
          ),

          dropDownMenus: (
            <AdminActivityDropdown
              params={params}
              updateFilterParams={updateFilterParams}
            />
          ),
        })}
      />
    </PageTemplate>
  );
};

export default AdminActivity;
