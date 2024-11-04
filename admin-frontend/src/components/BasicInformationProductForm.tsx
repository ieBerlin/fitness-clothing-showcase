import React, { FormEvent } from "react";
import TextInput from "./TextInput";
import { Form } from "react-router-dom";
import RadioGroup from "./RadioGroup";
import CheckboxGroup from "./CheckboxGroup";
import NumberInput from "./NumberInput";
import DateInput from "./DateInput";

import {
  availabilityOptions,
  genderOptions,
  seasonOptions,
} from "../utils/func";
import { ValidationError } from "../types/validation-error.types";
import Product from "../models/Product";
import Season from "../enums/Season";
import Availability from "../enums/Availability";
import ActionButton from "./ActionButton";
import Gender from "../enums/Gender";

interface BasicInformationProductFormProps {
  errors?: ValidationError[];
  onStepNext: (e: FormEvent<HTMLFormElement>) => void;
  isEditing: boolean;
  isLoading: boolean;
  defaultValues: Product;
  onInputCheckChange: (
    selectedValues: Season[] | Availability | Gender
  ) => void;
}

const BasicInformationProductForm: React.FC<
  BasicInformationProductFormProps
> = ({
  errors = [],
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
  const getErrorMessage = (field: string) =>
    errors.find((error) => error.field === field)?.message || "";
  return (
    <Form
      onSubmit={onStepNext}
      className="text-gray-800 bg-white p-8 border border-gray-200"
    >
      <div className="flex w-full justify-end mb-4">
        {" "}
        <ActionButton isLoading={isLoading} disabled={isLoading} type="submit">
          Save Changes
        </ActionButton>
      </div>
      {isEditing && (
        <TextInput
          label="Product ID"
          placeholder="Enter the product ID..."
          readOnly
          disabled
          name="product-id"
          value={defaultValues._id ?? ""}
          required
          isError={!!getErrorMessage("product-id")}
          errorMessage={getErrorMessage("product-id")}
        />
      )}
      <TextInput
        label="Product Name"
        placeholder="Enter the product name..."
        name="product-name"
        required
        defaultValue={defaultValues.productName}
        isError={!!getErrorMessage("product-name")}
        errorMessage={getErrorMessage("product-name")}
      />
      <TextInput
        label="Product Description"
        placeholder="Enter the product description..."
        type="textarea"
        name="product-description"
        required
        defaultValue={defaultValues.productDescription}
        isError={!!getErrorMessage("product-description")}
        errorMessage={getErrorMessage("product-description")}
      />
      <RadioGroup
        label="Gender"
        options={genderOptions}
        selectedValue={defaultValues.gender}
        name="gender"
        required
        onChange={(e) =>
          onInputCheckChange(e.target.value.toUpperCase() as Gender)
        }
        isError={!!getErrorMessage("gender")}
        errorMessage={getErrorMessage("gender")}
      />
      <NumberInput
        min={0}
        name="product-price"
        label="Price"
        required
        defaultValue={defaultValues.price}
        isError={!!getErrorMessage("product-price")}
        errorMessage={getErrorMessage("product-price")}
      />
      <DateInput
        type="datetime-local"
        name="product-release-date"
        label="Release Date"
        required
        defaultValue={formattedDate}
        isError={!!getErrorMessage("product-release-date")}
        errorMessage={getErrorMessage("product-release-date")}
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
        isError={!!getErrorMessage("product-availability")}
        errorMessage={getErrorMessage("product-availability")}
      />
      <NumberInput
        min={0}
        max={100}
        label="Wool Percentage"
        placeholder="Enter wool percentage"
        name="product-wool-percentage"
        defaultValue={defaultValues.woolPercentage}
        isError={!!getErrorMessage("product-wool-percentage")}
        errorMessage={getErrorMessage("product-wool-percentage")}
      />

      <CheckboxGroup
        label="Available Seasons"
        options={seasonOptions}
        name="product-season"
        checkedValues={defaultValues.season}
        onChangeValues={(seasons) => onInputCheckChange(seasons as Season[])}
        isError={!!getErrorMessage("product-season")}
        errorMessage={getErrorMessage("product-season")}
      />
    </Form>
  );
};

export default BasicInformationProductForm;
