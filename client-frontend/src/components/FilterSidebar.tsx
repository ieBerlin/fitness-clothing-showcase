import React, { useState } from "react";
import { formattedAvailabilityOptions } from "../constants/dropdownOptions.ts";
import PriceOptions from "../enums/PriceOptions.ts";

const FilterSidebar: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
  const [selectedPrice, setSelectedPrice] = useState<PriceOptions>(
    PriceOptions.ALL
  );

  const handlePriceChange = (value: PriceOptions) => {
    setSelectedPrice(value);
  };

  return (
    <aside className="filter-menu w-64 p-4 h-screen bg-white" style={style}>
      <h2 className="text-lg font-bold text-black uppercase tracking-wider mb-6">
        Filter & Sort
      </h2>

      {/* Price Range Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-black text-sm uppercase tracking-wide mb-4">
          Price
        </h3>
        <div className="flex flex-col gap-3">
          {Object.values(PriceOptions).map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-all duration-300"
            >
              <input
                type="radio"
                name="price"
                value={option}
                className="accent-black"
                checked={selectedPrice === option}
                onChange={() => handlePriceChange(option)}
                aria-label={`Price option: ${option}`}
              />
              <span className="text-sm uppercase ">
                {option === PriceOptions.ALL && "All Prices"}
                {option === PriceOptions.LESS_THAN_5000 && "< $5,000"}
                {option === PriceOptions.BETWEEN_5000_AND_10000 &&
                  "$5,000 - $10,000"}
                {option === PriceOptions.OVER_10000 && "> $10,000"}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-6 border-black" />

      {/* Availability Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-black text-sm uppercase tracking-wide mb-4">
          Availability
        </h3>
        <ul>
          {formattedAvailabilityOptions.map((item) => (
            <li key={item.value} className="mb-2">
              <label className="flex text-sm items-center mt-2 cursor-pointer hover:bg-gray-200 transition-all duration-300 rounded-lg p-2">
                <input
                  type="checkbox"
                  className="mr-3 accent-black"
                  aria-label={`Availability option: ${item.label}`}
                />
                <span className=" uppercase">{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default FilterSidebar;
