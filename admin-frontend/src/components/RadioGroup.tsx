import { FC, InputHTMLAttributes } from "react";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  options: RadioOption[];
  selectedValue?: string;
  name: string;
  isError?: boolean;
  errorMessage?: string;
}

const RadioGroup: FC<RadioInputProps> = ({
  name,
  label,
  options = [],
  selectedValue,
  isError = false,
  errorMessage,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <label className="block my-2 font-semibold text-sm text-gray-700">
        {label}
      </label>
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-gray-200 border-2 p-2 rounded-lg justify-center">
        {options.map((option) => {
          const isChecked: boolean =
            selectedValue?.toLowerCase() === option.value;
          return (
            <div key={option.value} className="flex items-center">
              <input
                value={option.value}
                id={`${label}-${option.value}`}
                type="radio"
                name={name}
                checked={isChecked}
                className={`mr-2 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 ${
                  isError ? "border-red-500" : ""
                }`}
                readOnly
                {...props}
              />
              <label
                htmlFor={`${label}-${option.value}`}
                className="text-sm text-gray-500 whitespace-nowrap"
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      {isError && errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default RadioGroup;
