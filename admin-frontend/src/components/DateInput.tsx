import React, { InputHTMLAttributes } from "react";

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  name: string;
}

const DateInput: React.FC<DateInputProps> = ({ name, label, placeholder, ...props }) => {
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
        className="py-2 px-4 block w-full border-gray-200 border-2 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default DateInput;
