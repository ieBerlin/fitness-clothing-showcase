import React, { FormEvent, useEffect, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import {
  Availability,
  Color,
  ColorOption,
  Image,
  Product,
  ProductResponse,
  Season,
} from "../types/product.types";
import { useLocation, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editProduct, fetchProduct } from "../utils/http";
import ProductForm from "../components/ProductForm";
import { Step, steps } from "../types/component.types";
import { Size } from "../types/product.types";
import { ValidationError } from "../types/validation-error.types";
import LoadingSpinner from "../components/LoadingSpinner";

const EditProductPage: React.FC = () => {
  const location = useLocation();
  const step: Step = location.state?.step || steps[0];
  const [activeStep, setActiveStep] = useState<Step>(step);
  const { productId } = useParams<{ productId: string }>();
  const [formData, setFormData] = useState<Partial<Product>>({});
  const { isFetching, data: fetchedProductData } = useQuery<
    ProductResponse,
    ValidationError[]
  >({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct({ productId: productId as string }),
    staleTime: Infinity,
  });
  const { mutate, isPending } = useMutation<
    ProductResponse,
    ValidationError[],
    Product
  >({
    mutationKey: ["product"],
    mutationFn: editProduct,
    onError: (errors) => {
      console.log(errors);
    },
    onSuccess: () => {
      const currentStepIndex = steps.findIndex(
        (step) => step.id === activeStep.id
      );
      if (currentStepIndex < steps.length - 1) {
        setActiveStep(steps[currentStepIndex + 1]);
      }
    },
  });
  const isLoading = isFetching || isPending;
  useEffect(() => {
    if (fetchedProductData && fetchedProductData.success) {
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
      woolPercentage: +(fd.get("product-wool-percentage") || 0),
      price: +(fd.get("product-price") || 0),
      releaseDate: new Date(fd.get("product-release-date") as string),
      isUnisex: (fd.get("product-unisex") as string) === "true",
      availability: fd.get("product-availability") as Availability,
      season: (fd.getAll("product-season") as string[]).map(
        (season) => season.toUpperCase() as Season
      ),
      colors: fetchedProductData?.product.colors as ColorOption[],
      images: fetchedProductData?.product.images as Image[],
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
    } else if (activeStep.id === "image-upload") {
      console.log("Image Uploaded");
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
  return (
    <PageTemplate title="Edit Product Details">
      <ProductForm
        isEditing
        isLoading={isLoading}
        productData={formData}
        onProductDataChange={setFormData}
        currentStepId={activeStep.id}
        onStepNext={handleNextStep}
        onStepPrevious={handlePreviousStep}
      />
    </PageTemplate>
  );
};

export default EditProductPage;
