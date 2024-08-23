import React, { SelectHTMLAttributes } from "react";

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  data: { value: string | number; label: string }[];
  selectedField?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  data,
  selectedField,
  ...props
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          className="capitalize block w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
          defaultValue={selectedField?.toUpperCase()}
          {...props}
        >
          {data.map((item) => (
            <option key={item.value} value={item.value} className=" capitalize">
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectInput;
