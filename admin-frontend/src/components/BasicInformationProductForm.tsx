import React, { FormEvent } from "react";
import TextInput from "./TextInput";
import { Form } from "react-router-dom";
import RadioGroup from "./RadioGroup";
import CheckboxGroup from "./CheckboxGroup";
import NumberInput from "./NumberInput";
import DateInput from "./DateInput";
import PriceInput from "./PriceInput";
import { Availability, Product, Season } from "../types/product.types";
import { availabilityOptions, seasonOptions } from "../utils/func";

interface BasicInformationProductFormProps {
  onStepNext: (e: FormEvent<HTMLFormElement>) => void;
  isEditing: boolean;
  isLoading: boolean;
  defaultValues: Product;
  onInputCheckChange: (
    selectedValues: Season[] | boolean | Availability
  ) => void;
}

const BasicInformationProductForm: React.FC<
  BasicInformationProductFormProps
> = ({
  onStepNext,
  isEditing,
  isLoading,
  defaultValues,
  onInputCheckChange,
}) => {
  const formattedDate =
    defaultValues.releaseDate &&
    !isNaN(new Date(defaultValues.releaseDate).getTime())
      ? new Date(defaultValues.releaseDate).toISOString().slice(0, 16)
      : "";
  return (
    <Form onSubmit={onStepNext} className="text-gray-800">
      {isEditing && (
        <TextInput
          label="Product ID"
          placeholder="Enter the product ID..."
          readOnly
          name="product-id"
          value={defaultValues._id ?? ""}
          required
        />
      )}
      <TextInput
        label="Product Name"
        placeholder="Enter the product name..."
        name="product-name"
        required
        defaultValue={defaultValues.productName}
      />
      <TextInput
        label="Product Description"
        placeholder="Enter the product description..."
        type="textarea"
        name="product-description"
        required
        defaultValue={defaultValues.productDescription}
      />
      <RadioGroup
        label="Unisex"
        options={[
          { label: "YES", value: "true" },
          { label: "NO", value: "false" },
        ]}
        selectedValue={
          typeof defaultValues.isUnisex === "boolean"
            ? defaultValues.isUnisex
              ? "true"
              : "false"
            : undefined
        }
        name="product-unisex"
        required
        onChange={(e) =>
          onInputCheckChange(e.target.value.toUpperCase()==="TRUE")
        }
      />
      <PriceInput
        name="product-price"
        required
        defaultValue={defaultValues.price}
      />
      <DateInput
        type="datetime-local"
        name="product-release-date"
        label="Release Date"
        required
        defaultValue={formattedDate}
      />
      <RadioGroup
        label="Availability"
        options={availabilityOptions}
        selectedValue={defaultValues.availability}
        name="product-availability"
        required
        onChange={(e) =>
          onInputCheckChange(e.target.value.toUpperCase() as Availability)
        }
      />
      <NumberInput
        min={0}
        max={100}
        label="Wool Percentage"
        placeholder="Enter wool percentage"
        name="product-wool-percentage"
        defaultValue={defaultValues.woolPercentage}
      />
      <CheckboxGroup
        label="Available Seasons"
        options={seasonOptions}
        name="product-season"
        checkedValues={defaultValues.season}
        onChangeValues={(seasons) => onInputCheckChange(seasons as Season[])}
      />
      <div className="flex w-full justify-end mt-4">
        <button
          disabled={isLoading}
          type="submit"
          className={`px-3 py-2 rounded-md text-white transition-colors ${
            isLoading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gray-900 hover:bg-gray-800"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                />
                <path d="M4 12a8 8 0 1 1 16 0" stroke="currentColor" />
              </svg>
              Loading...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </Form>
  );
};

export default BasicInformationProductForm;
