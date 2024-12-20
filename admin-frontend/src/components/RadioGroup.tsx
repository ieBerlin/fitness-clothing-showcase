import { FC, InputHTMLAttributes } from "react";
import { snakeCaseToReadable } from "../utils/func";

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean; // Added for disabling options
}

interface RadioInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  classes?: string;
  label: string;
  options: RadioOption[];
  selectedValue?: string;
  name: string;
  isError?: boolean;
  errorMessage?: string;
}

const RadioGroup: FC<RadioInputProps> = ({
  classes = "flex-wrap",
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
      <label className="block font-semibold text-sm white my-2">
        {snakeCaseToReadable(label)}
      </label>
      <div
        className={`flex ${classes} justify-evenly py-1 transition-all duration-200 ${
          isError ? "border-red-500" : "border-gray-300"
        } bg-[#171717]`}
      >
        {options.map((option) => {
          const isChecked =
            selectedValue?.toLowerCase() === option.value.toLowerCase();
          return (
            <div
              key={option.value}
              className="flex items-center hover:bg-[#212121] py-2"
            >
              <input
                value={option.value}
                id={`${label}-${option.value}`}
                type="radio"
                name={name}
                checked={isChecked}
                className={`mr-2 h-4 w-4 appearance-none rounded-full focus:ring-blue-500 focus:outline-none ${
                  isChecked
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300 bg-gray-200"
                } cursor-pointer ${
                  option.disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                {...props}
                disabled={option.disabled || false} // Set disabled based on option.disabled
              />
              <label
                htmlFor={`${label}-${option.value}`}
                className={`text-sm cursor-pointer transition-colors duration-200 text-white ${
                  isChecked ? "font-semibold " : ""
                }`}
              >
                {snakeCaseToReadable(option.label)}
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
