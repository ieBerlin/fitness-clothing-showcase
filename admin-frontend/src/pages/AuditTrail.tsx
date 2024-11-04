import { FC, useCallback, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import { fetchActivities } from "../utils/authUtils";
import { ExtendedFilterParams } from "../utils/http";
import Notification from "../models/Notification";
import DataTable from "../components/DataTable";
import { getDateRanges } from "../constants/dropdownOptions";
import {
  ActivityFilterParams,
  defaultFilterParams,
} from "../types/activityFilters";
import AdminActivityDropdown from "../components/AdminActivityDropdown";
import ActivityLogItem from "../components/ActivityLogItem";
import { getQueryKey } from "../constants/queryKeys";

const AuditTrail: FC = () => {
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
    <PageTemplate title="Product Audit Trail">
      <DataTable<Notification, ActivityFilterParams>
        key="audit-trail-data-table"
        updateParams={handleUpdateArgs}
        fetchDataParams={fetchFilteringArgs}
        initialParams={params}
        queryKey={getQueryKey("notifications")}
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

export default AuditTrail;
