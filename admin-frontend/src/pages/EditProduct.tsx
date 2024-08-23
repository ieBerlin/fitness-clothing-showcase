import React, { FormEvent, useEffect, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import PriceInput from "../components/PriceInput";
import DateInput from "../components/DateInput";
import {
  Availability,
  Color,
  ColorOption,
  Product,
  ProductResponse,
  Season,
} from "../types/product.types";
import { Form, useParams } from "react-router-dom";
import RadioGroup from "../components/RadioGroup";
import NumberInput from "../components/NumberInput";
import CheckboxGroup from "../components/CheckboxGroup";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "../utils/http";
import { Step } from "../types/component.types";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductColors from "../components/ProductColors";
import { Size } from "../types/product.types";
import { steps } from "./../types/component.types";
import { availabilityOptions } from "../utils/func";
import TextInput from "./../components/TextInput";

const EditProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [activeStep, setActiveStep] = useState<Step>(steps[0]);

  const {
    isFetching,
    isError,
    data: fetchedProductData,
  } = useQuery<ProductResponse>({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct({ productId: productId as string }),
  });
  useEffect(() => {
    if (fetchedProductData?.product) {
      setFormData(fetchedProductData.product);
    }
  }, [fetchedProductData]);

  const handleNextStep = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);

    const updatedProductData: Partial<Product> = {
      _id: productId,
      productName: fd.get("product-name") as string,
      productDescription: fd.get("product-description") as string,
      woolPercentage: +(fd.get("product-wool-percentage") as string),
      price: +(fd.get("product-price") as string),
      releaseDate: new Date(fd.get("product-release-date") as string),
      isUnisex: fd.get("product-unisex") === "true",
      availability: fd.get("product-availability") as Availability,
      season: (fd.getAll("product-season") as string[]).map(
        (season) => season as Season
      ),
      colors: fetchedProductData?.product.colors,
    };

    if (activeStep.id === "basic-info") {
      setFormData(updatedProductData);
    } else if (activeStep.id === "color-selection") {
      const selectedColors: ColorOption[] = (fd.getAll("colors") as string[])
        .map((color) => {
          const listItem = document.getElementById(
            `color-${color.toLowerCase()}`
          ) as HTMLLIElement | null;

          if (!listItem) return null;

          const availableSizes: Size[] = Array.from(
            listItem.querySelectorAll("li")
          )
            .map((sizeItem) => {
              const sizeName = sizeItem
                .querySelector("span")
                ?.textContent?.trim();
              const quantityInput = sizeItem.querySelector(
                "input[type='number']"
              ) as HTMLInputElement;
              const availabilitySelect = sizeItem.querySelector(
                "select"
              ) as HTMLSelectElement;

              if (!sizeName || !quantityInput || !availabilitySelect)
                return null;

              return {
                name: sizeName,
                quantity: parseInt(quantityInput.value, 10),
                sizeAvailability: availabilitySelect.value as Availability,
              };
            })
            .filter((size): size is Size => size !== null);

          return {
            name: color as Color,
            availableSizes,
          };
        })
        .filter(
          (colorOption): colorOption is ColorOption => colorOption !== null
        );

      updatedProductData.colors = selectedColors;
      setFormData((prevData) => ({ ...prevData, colors: selectedColors }));
    }

    const currentStepIndex = steps.findIndex(
      (step) => step.id === activeStep.id
    );
    if (currentStepIndex < steps.length - 1) {
      setActiveStep(steps[currentStepIndex + 1]);
    }
  };

  const handlePreviousStep = () => {
    const currentStepIndex = steps.findIndex(
      (step) => step.id === activeStep.id
    );
    if (currentStepIndex > 0) {
      setActiveStep(steps[currentStepIndex - 1]);
    }
  };

  const seasonOptions = Object.entries(Season).map(([key, value]) => ({
    value: value.toLowerCase(),
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));
  if (isFetching) {
    return <LoadingSpinner dimension="w-12 h-12" />;
  }

  if (isError) {
    return (
      <div className="bg-white">
        <h2 className="text-gray-800 font-semibold text-center py-3">
          An error occurred while fetching the data.
        </h2>
      </div>
    );
  }

  if (isError || !fetchedProductData?.product) {
    return (
      <div className="bg-white">
        <h2 className="text-gray-800 font-semibold text-center py-3">
          There is no data to show
        </h2>
      </div>
    );
  }
  function handleChangeCheckbox(seasons: string[]) {
    setFormData((prevData) => ({ ...prevData, season: seasons as Season[] }));
  }
  let formContent: React.ReactNode;
  switch (activeStep.id) {
    case "basic-info":
      {
        const formattedDate =
          formData?.releaseDate &&
          !isNaN(new Date(formData.releaseDate).getTime())
            ? new Date(formData.releaseDate).toISOString().slice(0, 16)
            : "";
        formContent = (
          <Form onSubmit={handleNextStep} className="text-gray-800">
            <TextInput
              label="Product ID"
              placeholder="Enter the product ID..."
              readOnly
              name="product-id"
              value={productId}
              required
            />
            <TextInput
              label="Product Name"
              placeholder="Enter the product name..."
              name="product-name"
              required
              defaultValue={formData?.productName}
            />
            <TextInput
              label="Product Description"
              placeholder="Enter the product description..."
              type="textarea"
              name="product-description"
              required
              defaultValue={formData?.productDescription}
            />
            <RadioGroup
              label="Unisex"
              options={[
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              selectedValue={formData?.isUnisex ? "true" : "false"}
              name="product-unisex"
              required
            />
            <PriceInput
              name="product-price"
              required
              defaultValue={formData?.price}
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
              selectedValue={formData?.availability ?? Availability.UNAVAILABLE}
              name="product-availability"
              required
            />
            <NumberInput
              min={0}
              max={100}
              label="Wool Percentage"
              placeholder="Enter wool percentage"
              name="product-wool-percentage"
              defaultValue={formData?.woolPercentage ?? 0}
            />
            <CheckboxGroup
              label="Available Seasons"
              options={seasonOptions}
              name="product-season"
              checkedValues={formData?.season?.map((item) =>
                item.toLocaleLowerCase()
              )}
              onChangeValues={handleChangeCheckbox}
            />
            <div className="flex w-full justify-end mt-4">
              <button
                type="submit"
                className="bg-gray-900 px-3 py-2 rounded-md text-white"
              >
                Save Changes
              </button>
            </div>
          </Form>
        );
      }
      break;

    case "color-selection":
      formContent = (
        <Form onSubmit={handleNextStep}>
          <ProductColors
            productColors={formData.colors ?? []}
            selectedColors={formData.colors ?? []}
            isUnisex={formData.isUnisex ?? false}
          />
          <div className="flex w-full justify-between mt-4">
            <button
              onClick={handlePreviousStep}
              type="button"
              className="bg-gray-900 px-3 py-2 rounded-md text-white"
            >
              Previous Step
            </button>
            <button
              type="submit"
              className="bg-gray-900 px-3 py-2 rounded-md text-white"
            >
              Next Step
            </button>
          </div>
        </Form>
      );
      break;

    case "image-upload":
      formContent = (
        <Form onSubmit={handleNextStep}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Front View
            </label>
            <input
              type="file"
              name="frontImage"
              accept="image/*"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Side View
            </label>
            <input
              type="file"
              name="sideImage"
              accept="image/*"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Back View
            </label>
            <input
              type="file"
              name="backImage"
              accept="image/*"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            />
          </div>
          <div className="flex w-full justify-between mt-4">
            <button
              onClick={handlePreviousStep}
              type="button"
              className="bg-gray-900 px-3 py-2 rounded-md text-white"
            >
              Previous Step
            </button>
            <button
              type="submit"
              className="bg-gray-900 px-3 py-2 rounded-md text-white"
            >
              Save Changes
            </button>
          </div>
        </Form>
      );
      break;

    default:
      formContent = <div>Invalid step</div>;
  }

  return (
    <PageTemplate title="Edit Product Details">{formContent}</PageTemplate>
  );
};

export default EditProductPage;
