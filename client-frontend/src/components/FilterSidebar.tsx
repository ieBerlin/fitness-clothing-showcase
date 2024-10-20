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
    <aside
      className="filter-menu w-64 p-4 h-screen border-r border-gray-300 bg-white"
      style={style}
    >
      <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-6">
        Filter & Sort
      </h2>

      {/* Categories Section */}
      {/* <div className="mb-6">
        <h3 className="font-semibold text-gray-800 text-sm tracking-wide mb-4">
          Categories
        </h3>
        <ul>
          <li className="py-3 px-2 hover:bg-green-100 rounded cursor-pointer text-gray-700 font-medium transition-all duration-300 ease-in-out">
            Men's
          </li>
          <li className="py-3 px-2 hover:bg-green-100 rounded cursor-pointer text-gray-700 font-medium transition-all duration-300 ease-in-out">
            Women's
          </li>
        </ul>
      </div> */}

      {/* <hr className="my-6 border-gray-300" /> */}

      {/* Price Range Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 text-sm tracking-wide mb-4">
          Price
        </h3>
        <div className="flex flex-col gap-3">
          {Object.values(PriceOptions).map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-green-100 transition-all duration-300"
            >
              <input
                type="radio"
                name="price"
                value={option}
                checked={selectedPrice === option}
                onChange={() => handlePriceChange(option)}
                className="form-radio text-green-600 focus:ring-green-500"
                aria-label={`Price option: ${option}`} // Improved accessibility
              />
              {option === PriceOptions.ALL && "All"}
              {option === PriceOptions.LESS_THAN_5000 && "Less than $5,000"}
              {option === PriceOptions.BETWEEN_5000_AND_10000 &&
                "Between $5,000 and $10,000"}
              {option === PriceOptions.OVER_10000 && "Over $10,000"}
            </label>
          ))}
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Availability Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 text-sm tracking-wide mb-4">
          Availability
        </h3>
        <ul>
          {formattedAvailabilityOptions.map((item) => (
            <li key={item.value} className="mb-2">
              <label className="flex items-center mt-2 cursor-pointer hover:bg-green-100 transition-all duration-300 rounded-lg p-2">
                <input
                  type="checkbox"
                  className="mr-3 accent-green-500"
                  aria-label={`Availability option: ${item.label}`}
                />
                <span className="text-gray-700">{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default FilterSidebar;
