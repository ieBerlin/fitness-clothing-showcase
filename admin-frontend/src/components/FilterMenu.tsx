import React from "react";
import CheckboxGroup, { CheckboxOption } from "./CheckboxGroup";

interface FilterProps {
  label: string;
  name: string;
  options: CheckboxOption[];
  defaultCheckedValues: string[];
  onCheck: (updatedValues: string[]) => void;
}

const FilterMenu: React.FC<FilterProps> = ({
  label,
  name,
  options,
  defaultCheckedValues,
  onCheck,
}) => {
  return (
    <div className="flex flex-col space-y-2 p-4 bg-[#171717] text-white">
      <CheckboxGroup
        classes="flex-col"
        name={name}
        checkedValues={defaultCheckedValues}
        options={options}
        label={label}
        onChangeValues={onCheck}
      />
    </div>
  );
};

export default FilterMenu;
