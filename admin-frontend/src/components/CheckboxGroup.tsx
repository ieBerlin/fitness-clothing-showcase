import { FC, InputHTMLAttributes } from "react";
import { snakeCaseToReadable } from "../utils/func";

export interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  options: CheckboxOption[];
  name: string;
  checkedValues?: string[];
  onChangeValues: (selectedValues: string[]) => void;
  isError?: boolean;
  errorMessage?: string;
  classes?: string;
}

const CheckboxGroup: FC<CheckboxGroupProps> = ({
  name,
  label,
  options,
  checkedValues = [],
  onChangeValues,
  isError = false,
  errorMessage,
  classes = "flex-row",
}) => {
  const handleCheckboxChange = (value: string) => {
    const newCheckedValues = checkedValues.includes(value)
      ? checkedValues.filter((v) => v !== value) // Remove the value if already checked
      : [...checkedValues, value]; // Add the value if not checked
    onChangeValues(newCheckedValues); // Trigger a callback or update state
  };
  return (
    <div className="flex flex-col">
      <label className="block my-2 font-semibold text-sm white">
        {snakeCaseToReadable(label)}
      </label>
      <div
        className={`flex bg-[#171717] ${classes} w-full justify-around ${
          isError ? "border-red-500" : ""
        }`}
      >
        {options.map((option) => {
          const isChecked = checkedValues.includes(option.value.toLowerCase());
          return (
            <li key={option.value} className={"flex items-center p-2"}>
              <input
                type="checkbox"
                id={option.value}
                checked={isChecked}
                value={option.value}
                name={name}
                onChange={() => handleCheckboxChange(option.value)}
                className={`mr-2 border-gray-200 rounded text-blue-600 focus:ring-blue-500 ${
                  isError ? "border-red-500" : ""
                }`}
              />
              <label
                htmlFor={option.value}
                className={`text-sm ${
                  isError ? "text-red-500" : "text-white "
                }`}
              >
                {snakeCaseToReadable(option.label)}
              </label>
            </li>
          );
        })}
      </div>
      {isError && errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default CheckboxGroup;
