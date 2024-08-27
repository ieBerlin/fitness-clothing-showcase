import React, { InputHTMLAttributes } from "react";

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  name: string;
  isError?: boolean;
  errorMessage?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  name,
  label,
  placeholder,
  isError = false,
  errorMessage,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="block my-2 font-semibold text-sm text-gray-700">
          {label}
        </label>
      )}
      <input
        name={name}
        type="date"
        className={`py-2 px-4 block w-full border-2 rounded-lg text-sm ${
          isError
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        } focus:outline-none`}
        placeholder={placeholder}
        {...props}
      />
      {isError && errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default DateInput;
