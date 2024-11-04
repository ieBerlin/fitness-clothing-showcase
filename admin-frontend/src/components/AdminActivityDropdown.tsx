// import EntityType from "../enums/EntityType";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import DropdownMenu from "../components/DropdownMenu";
import { ExtendedFilterParams } from "../utils/http";
import RadioGroup from "../components/RadioGroup";
import DropdownFilterGroup from "../components/FilterDropdownMenus";
import TimeOption from "../enums/TimeOption";
import { ActivityFilterParams } from "../types/activityFilters";
import ItemLimitDropdownMenu from "./ItemLimitDropdownMenu";
import FilterMenu from "./FilterMenu";
import ActivityType from "../enums/ActivityType";
import { activityTypeOptions } from "../utils/func";
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
              options={activityTypeOptions}
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
      ]}
    />
  );
};

export default AdminActivityDropdown;
