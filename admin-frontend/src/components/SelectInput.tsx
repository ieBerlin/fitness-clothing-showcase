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
      <label className="block my-2 font-semibold text-sm text-gray-700">
        {label}
      </label>
      <div className="relative w-full">
        <select
          className="capitalize block w-full border-2 border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
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
