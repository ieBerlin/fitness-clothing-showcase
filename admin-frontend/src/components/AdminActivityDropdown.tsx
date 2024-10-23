import ActivityType from "../enums/ActivityType";
import EntityType from "../enums/EntityType";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import DropdownMenu from "../components/DropdownMenu";
import { ExtendedFilterParams, queryClient } from "../utils/http";
import RadioGroup from "../components/RadioGroup";
import FilterMenu from "../components/FilterMenu";
import DropdownFilterGroup from "../components/FilterDropdownMenus";
import { activityQueryKey } from "../constants/queryKeys";
import TimeOption from "../enums/TimeOption";
import { ActivityFilterParams } from "../types/activityFilters";
import ItemLimitDropdownMenu from "./ItemLimitDropdownMenu";
const AdminActivityDropdown = ({
  updateFilterParams,
  params,
}: {
  params: ExtendedFilterParams<ActivityFilterParams>;
  updateFilterParams: <
    K extends keyof ExtendedFilterParams<ActivityFilterParams>
  >(
    paramKey: K,
    paramValue: ExtendedFilterParams<ActivityFilterParams>[K]
  ) => void;
}) => {
  return (
    <DropdownFilterGroup
      dropDownMenus={[
        <ItemLimitDropdownMenu
          params={params}
          updateFilterParams={updateFilterParams}
        />,
        <DropdownMenu
          label={
            <div className="flex items-center gap-2 px-3 py-2 border bg-gray-50 text-gray-800">
              <span className="text-lg font-semibold">Timing</span>
              <ChevronDoubleDownIcon className="w-5 h-5 text-gray-600" />
            </div>
          }
          content={
            <div className="flex flex-col p-4 bg-[#171717] text-white">
              <RadioGroup
                classes="flex-col border-0"
                label="Timing"
                onChange={(e) =>
                  updateFilterParams("timing", e.target.value as TimeOption)
                }
                options={Object.values(TimeOption).map((item) => ({
                  label: item.charAt(0).toUpperCase() + item.slice(1),
                  value: item,
                }))}
                name={"timing"}
                selectedValue={params.timing}
              />
            </div>
          }
        />,
        <DropdownMenu
          closeOnContentClick={false}
          onSubmit={() => {
            queryClient.invalidateQueries({ queryKey: activityQueryKey });
          }}
          label={
            <div className="flex items-center gap-2 px-3 py-2 border bg-gray-50 text-gray-800">
              <span className="text-lg font-semibold">Activity Type</span>
              <ChevronDoubleDownIcon className="w-5 h-5 text-gray-600" />
            </div>
          }
          content={
            <FilterMenu
              label="Activity Type"
              name="activity-type"
              options={Object.values(ActivityType).map((item) => ({
                label: item.charAt(0).toUpperCase() + item.slice(1),
                value: item,
              }))}
              onCheck={(updatedValues) =>
                updateFilterParams(
                  "activityType",
                  updatedValues as ActivityType[]
                )
              }
              defaultCheckedValues={params.activityType || []}
            />
          }
        />,
        <DropdownMenu
          closeOnContentClick={false}
          onSubmit={() => {
            queryClient.invalidateQueries({ queryKey: activityQueryKey });
          }}
          label={
            <div className="flex items-center gap-2 px-3 py-2 border bg-gray-50 text-gray-800">
              <span className="text-lg font-semibold">Entity Type</span>
              <ChevronDoubleDownIcon className="w-5 h-5 text-gray-600" />
            </div>
          }
          content={
            <FilterMenu
              label="Entity Type"
              name="entity-type"
              options={Object.values(EntityType).map((item) => ({
                label: item.charAt(0).toUpperCase() + item.slice(1),
                value: item,
              }))}
              onCheck={(updatedValues) =>
                updateFilterParams("entityType", updatedValues as EntityType[])
              }
              defaultCheckedValues={params.entityType || []}
            />
          }
        />,
      ]}
    />
  );
};

export default AdminActivityDropdown;
