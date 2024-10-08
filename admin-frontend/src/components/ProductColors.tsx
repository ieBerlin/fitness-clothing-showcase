/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";

import NumberInput from "./NumberInput";
import SelectInput from "./SelectInput";
import Size, { defaultSizes, genderSizes } from "../models/Size";
import ColorOption from "../models/Color";
import Availability from "../enums/Availability";
import Color from "../enums/Color";

interface ProductColorsProps {
  productColors?: ColorOption[];
  isUnisex: boolean;
}
interface ColorItemProps {
  colorOption: ColorOption;
  isSelected: boolean;
  isUnisex: boolean;
}
interface SizesProps {
  isUnisex: boolean;
  availableSizes: Size[];
  visibility: boolean;
}
const ColorItem: FC<ColorItemProps> = ({
  colorOption,
  isSelected,
  isUnisex,
}) => {
  const [checkbox, setCheckbox] = useState<{
    isChecked: boolean;
    isShown: boolean;
  }>({
    isChecked: isSelected,
    isShown: false,
  });
  const handleCheckboxChange = (_: React.ChangeEvent<HTMLInputElement>) => {
    setCheckbox((prev) => ({
      // isShown: prev.isShown ? false : prev.isShown,
      isShown: !prev.isChecked,
      isChecked: !prev.isChecked,
    }));
  };
  const toggleCheckboxVisibility = () => {
    setCheckbox((prev) => ({
      ...prev,
      isShown: !prev.isShown,
    }));
  };
  const hexCode =
    Color[colorOption.name.toUpperCase() as unknown as keyof typeof Color];
  return (
    <li
      className="flex flex-col mb-4"
      id={`color-${colorOption.name.toLocaleLowerCase()}`}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <input
            type="checkbox"
            name="colors"
            value={colorOption.name.toLocaleLowerCase()}
            checked={checkbox.isChecked}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <div
            className="w-5 h-5 rounded-full border-[0.5px] border-gray-700"
            style={{
              backgroundColor: hexCode,
            }}
          />
          <label
            htmlFor={`color-${colorOption.name}`}
            className="text-sm font-medium text-gray-600"
          >
            {colorOption.name.toUpperCase()}
          </label>
        </div>
        <button
          type="button"
          onClick={toggleCheckboxVisibility}
          className="text-blue-800 font-semibold"
        >
          {checkbox.isChecked && checkbox.isShown ? "Hide" : "Show"}
        </button>
      </div>
      {checkbox.isChecked && (
        <Sizes
          visibility={checkbox.isChecked && checkbox.isShown}
          isUnisex={isUnisex}
          availableSizes={colorOption.availableSizes}
        />
      )}
    </li>
  );
};
const Sizes: FC<SizesProps> = ({ visibility, isUnisex, availableSizes }) => {
  const displaySizes = isUnisex
    ? availableSizes
    : availableSizes.filter(
        (size) =>
          genderSizes.men.includes(size.name) ||
          genderSizes.women.includes(size.name)
      );
  return (
    <div
      style={{
        visibility: visibility ? "visible" : "hidden",
        height: visibility ? "auto" : "0",
        padding: visibility ? "auto" : "0",
        margin: visibility ? "auto" : "0",
        width: visibility ? "100%" : "0",
        overflow: visibility ? "visible" : "hidden",
      }}
    >
      <ul className="ml-6 list-disc text-gray-600 mt-2">
        {displaySizes.map((size) => (
          <li
            key={size.name}
            className="flex flex-row justify-between items-center gap-4 bg-gray-200 p-3 rounded-lg shadow-sm mb-2"
          >
            <span className="text-gray-900 font-semibold">{size.name}</span>
            <div className="flex gap-4 items-center">
              <NumberInput
                min={0}
                label="Quantity"
                name={size.name}
                defaultValue={size.quantity}
              />
              <SelectInput
                selectedField={size.sizeAvailability}
                name="product-sizes-availability"
                label="Availability"
                data={Object.entries(Availability).map(([key, value]) => ({
                  value: key,
                  label: value.replace(/_/g, " "),
                }))}
              />
            </div>
          </li>
        ))}
      </ul>{" "}
    </div>
  );
};
const ProductColors: FC<ProductColorsProps> = ({
  productColors = [],
  isUnisex,
}) => {
  const colors = productColors;
  const unselectedColors: ColorOption[] = Object.entries(Color)
    .map(([key]) => {
      const isSelected = colors.some((item) => item.name.toUpperCase() === key);
      if (!isSelected) {
        return {
          name: key as Color,
          availableSizes: defaultSizes(),
        } as ColorOption;
      }
      return null;
    })
    .filter((color): color is ColorOption => color !== null);

  const allColors = [...colors, ...unselectedColors];

  return (
    <div>
      <ul className="px-3 py-2 flex flex-col gap-4 text-gray-800">
        {allColors.map((colorOption) => (
          <ColorItem
            key={colorOption.name}
            colorOption={colorOption}
            isSelected={productColors.some(
              (selected) => selected.name === colorOption.name
            )}
            isUnisex={isUnisex}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProductColors;
