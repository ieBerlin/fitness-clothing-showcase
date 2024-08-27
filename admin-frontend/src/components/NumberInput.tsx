import { FC, InputHTMLAttributes } from "react";

interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  readonly?: boolean;
  label?: string;
  min?: number;
  max?: number;
  name: string;
  isError?: boolean;
  errorMessage?: string;
}

const NumberInput: FC<NumberInputProps> = ({
  placeholder,
  readonly,
  label,
  min,
  max,
  name,
  isError = false,
  errorMessage,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          className={`block mb-2 font-semibold text-sm ${
            isError ? "text-red-500" : "text-gray-700"
          }`}
        >
          {label}
        </label>
      )}
      <input
        type="number"
        className={`py-2 px-4 block w-full border-2 rounded-lg text-sm focus:outline-none ${
          isError
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        }`}
        placeholder={placeholder}
        readOnly={readonly}
        min={min}
        max={max}
        name={name}
        {...props}
      />
      {isError && errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default NumberInput;
