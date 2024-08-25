import { FC, InputHTMLAttributes } from "react";

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  options: CheckboxOption[];
  name: string;
  checkedValues?: string[];
  onChangeValues: (selectedValues: string[]) => void;
}

const CheckboxGroup: FC<CheckboxGroupProps> = ({
  name,
  label,
  options,
  checkedValues = [],
  onChangeValues,
}) => {
  const handleCheckboxChange = (value: string) => {
    const newCheckedValues = checkedValues.includes(value)
      ? checkedValues.filter((v) => v !== value) // Remove the value if already checked
      : [...checkedValues, value]; // Add the value if not checked
    onChangeValues(newCheckedValues); // Trigger a callback or update state
  };
  return (
    <div className="flex flex-col">
      <label className="block my-2 font-semibold text-sm text-gray-700">
        {label}
      </label>
      <div className="flex flex-row gap-y-2 w-full justify-around">
        {options.map((option) => {
          const isChecked = checkedValues.includes(option.value.toLowerCase());
          return (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={option.value}
                checked={isChecked}
                value={option.value}
                name={name}
                onChange={() => handleCheckboxChange(option.value)}
                className="mr-2 border-gray-200 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={option.value} className="text-sm text-gray-500">
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckboxGroup;
