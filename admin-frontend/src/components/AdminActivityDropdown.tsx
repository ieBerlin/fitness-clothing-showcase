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
import { paginationOptions } from "../constants/dropdownOptions";
import { ActivityFilterParams } from "../types/activityFilters";

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
        <DropdownMenu
          label={
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-50 text-gray-800 shadow-sm">
              <span className="text-lg font-semibold">Showing</span>
              <ChevronDoubleDownIcon className="w-4 h-4 text-gray-600" />
            </div>
          }
          content={
            <ul className="space-y-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {paginationOptions.map((option) => (
                <li
                  key={option}
                  className="cursor-pointer hover:bg-gray-100 active:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out"
                  onClick={() => updateFilterParams("itemLimit", option)}
                >
                  <span className="text-gray-800 font-medium">{option}</span>
                </li>
              ))}
            </ul>
          }
        />,
        <DropdownMenu
          label={
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-50 text-gray-800 shadow-sm">
              <span className="text-lg font-semibold">Timing</span>
              <ChevronDoubleDownIcon className="w-5 h-5 text-gray-600" />
            </div>
          }
          content={
            <div className="flex flex-col space-y-2 p-2 text-gray-800">
              <RadioGroup
                classes="flex-col border-0"
                label="Price"
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
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-50 text-gray-800 shadow-sm">
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
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-50 text-gray-800 shadow-sm">
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
