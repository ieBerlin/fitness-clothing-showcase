import React from "react";
import TimeOption from "../enums/TimeOption";
import RadioGroup from "./RadioGroup";
import { NotificationFilterParams } from "../types/notificationFilters";
import { BaseFilterParams, ExtendedFilterParams } from "../utils/http";

interface TimingRadioGroupProps {
  updateFilterParams: <
    K extends keyof BaseFilterParams | keyof NotificationFilterParams
  >(
    paramKey: K,
    paramValue: ExtendedFilterParams<NotificationFilterParams>[K]
  ) => void;
  params: { timing: TimeOption };
}

const TimingRadioGroup: React.FC<TimingRadioGroupProps> = ({
  updateFilterParams,
  params,
}) => {
  const timingOptions = Object.values(TimeOption).map((item) => ({
    label: item.charAt(0).toUpperCase() + item.slice(1).replace(/_/g, " "),
    value: item,
  }));

  return (
    <div className="flex flex-col space-y-2 p-2 text-gray-800">
      <RadioGroup
        classes="flex-col"
        label="Timing"
        onChange={(e) =>
          updateFilterParams("timing", e.target.value as TimeOption)
        }
        options={timingOptions}
        name="timing"
        selectedValue={params.timing}
      />
    </div>
  );
};

export default TimingRadioGroup;
