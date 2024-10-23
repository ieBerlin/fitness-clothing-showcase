import React, { FormEvent, useEffect, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import { useLocation, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import ProductForm from "../components/ProductForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { editProduct, fetchProduct } from "../utils/authUtils";
import ErrorAlert from "../components/ErrorAlert";
import Product from "../models/Product";
import { ErrorResponse, ProductResponse } from "../types/response";
import ColorOption from "../models/Color";
import Season from "../enums/Season";
import Availability from "../enums/Availability";
import Image from "../models/Image";
import Size from "../models/Size";
import Color from "../enums/Color";
interface Step {
  id: string;
  label: string;
}

const steps: Step[] = [
  { id: "basic-info", label: "Basic Product Information" },
  { id: "color-selection", label: "Chosen Colors" },
  { id: "image-upload", label: "Images" },
];
const EditProductPage: React.FC = () => {
  const location = useLocation();
  const step: Step = location.state?.step || steps[0];
  const [activeStep, setActiveStep] = useState<Step>(step);
  const { productId } = useParams<{ productId: string }>();
  const [formData, setFormData] = useState<Partial<Product>>({});
  const {
    isFetching,
    data: productData,
    isError,
    error,
  } = useQuery<ProductResponse, ErrorResponse>({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId ?? ""),
  });
  const {
    mutate,
    isPending,
    error: mutationErrors,
    isError: isMutationError,
  } = useMutation<ProductResponse, ErrorResponse, Product>({
    mutationKey: ["product"],
    mutationFn: editProduct,
    onSuccess: (product) => {
      const currentStepIndex = steps.findIndex(
        (step) => step.id === activeStep.id
      );
      if (currentStepIndex < steps.length - 1) {
        setActiveStep(steps[currentStepIndex + 1]);
      }
      return product;
    },
  });
  const isLoading = isFetching || isPending;
  useEffect(() => {
    if (productData) {
      setFormData(productData);
    }
  }, [productData]);
  const handleNextStep = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);

    const updatedProductData: Partial<Product> = {
      _id: productId,
      productName: fd.get("product-name") as string,
      productDescription: fd.get("product-description") as string,
      woolPercentage: +(fd.get("product-wool-percentage") || 0),
      price: +(fd.get("product-price") || 0),
      releaseDate: new Date(fd.get("product-release-date") as string),
      isUnisex: (fd.get("product-unisex") as string) === "true",
      availability: fd.get("product-availability") as Availability,
      season: (fd.getAll("product-season") as string[]).map(
        (season) => season.toUpperCase() as Season
      ),
      colors: productData?.colors as ColorOption[],
      images: productData?.images as Image[],
    };

    if (activeStep.id === "basic-info") {
      setFormData(updatedProductData);
      mutate(updatedProductData as Product);
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
                sizeAvailability:
                  availabilitySelect.value.toLowerCase() as Availability,
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
      mutate({ ...formData, colors: selectedColors } as Product);
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

  if (isFetching) {
    return (
      <div className="flex items-center justify-center w-full py-10 flex-col gap-2">
        <LoadingSpinner fill="blue-600" text="gray-400" dimension="w-16 h-16" />
        <h2 className="text-gray-500 font-semibold">Loading...</h2>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="space-y-4">
        <ErrorAlert error={error} />
      </div>
    );
  }

  return (
    <PageTemplate title="Edit Product Details">
      <div className="bg-white h-full border border-gray-300 p-8">
        <ProductForm
          validationErrors={
            isMutationError && mutationErrors
              ? (mutationErrors as unknown as ErrorResponse).errors
              : undefined
          }
          isEditing
          isLoading={isLoading}
          productData={formData}
          onProductDataChange={setFormData}
          currentStepId={activeStep.id}
          onStepNext={handleNextStep}
          onStepPrevious={handlePreviousStep}
        />
      </div>
    </PageTemplate>
  );
};

export default EditProductPage;
