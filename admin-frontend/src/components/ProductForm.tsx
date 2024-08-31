import { FC, FormEvent } from "react";
import { Form } from "react-router-dom";
import ProductColors from "../components/ProductColors";
import BasicInformationProductForm from "./BasicInformationProductForm";
import ImagePicker from "./ImagePicker";
import { ValidationError } from "../types/validation-error.types";
import Product from "../models/Product";
import Availability from "../enums/Availability";
import Season from "../enums/Season";
import Image, { Angle } from "../models/Image";

interface ProductFormProps {
  validationErrors?: ValidationError[];
  isLoading?: boolean;
  isEditing?: boolean;
  productData: Partial<Product>;
  onProductDataChange: (updatedData: Partial<Product>) => void;
  currentStepId: string;
  onStepPrevious?: () => void;
  onStepNext: (e: FormEvent<HTMLFormElement>) => void;
}

const ProductForm: FC<ProductFormProps> = ({
  validationErrors = [],
  isLoading = false,
  isEditing = false,
  productData,
  onProductDataChange,
  currentStepId,
  onStepPrevious,
  onStepNext,
}) => {
  const handleInputCheckChange = (
    portion: Season[] | boolean | Availability
  ) => {
    let updatedProductData;

    if (Array.isArray(portion)) {
      updatedProductData = {
        ...productData,
        season: portion as Season[],
      };
    } else if (typeof portion === "boolean") {
      updatedProductData = {
        ...productData,
        isUnisex: portion,
      };
    } else {
      updatedProductData = {
        ...productData,
        availability: portion as Availability,
      };
    }

    onProductDataChange(updatedProductData);
  };

  const {
    _id,
    productName,
    productDescription,
    isUnisex,
    price,
    releaseDate,
    availability,
    woolPercentage,
    colors = [],
    season = [],
    images = [],
  } = productData;

  const defaultValues: Partial<Product> = {
    _id: isEditing ? _id : undefined,
    productName: productName,
    productDescription: productDescription,
    isUnisex: isUnisex,
    price: price,
    releaseDate,
    availability: availability,
    woolPercentage: woolPercentage,
    colors,
    season: season.map((item) => item.toLowerCase() as Season),
    images,
  };

  if (isEditing) {
    switch (currentStepId) {
      case "basic-info": {
        return (
          <BasicInformationProductForm
            errors={validationErrors}
            onInputCheckChange={handleInputCheckChange}
            defaultValues={defaultValues as Product}
            isLoading={isLoading}
            isEditing={isEditing}
            onStepNext={onStepNext}
          />
        );
      }
      case "color-selection":
        return (
          <Form onSubmit={onStepNext}>
            <ProductColors
              productColors={defaultValues.colors}
              isUnisex={defaultValues.isUnisex ?? false}
            />
            <div className="flex w-full justify-between mt-4">
              <button
                onClick={onStepPrevious}
                type="button"
                className="bg-gray-900 px-3 py-2 rounded-md text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous Step
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-gray-900 px-3 py-2 rounded-md text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLoading ? "bg-gray-600" : ""
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
                  "Next Step"
                )}
              </button>
            </div>
          </Form>
        );

      // Later we edit this
      case "image-upload": {
        const angles: Angle[] = ["back", "front", "side", "top", "bottom"];
        const imageMap = new Map<Angle, Image>(
          (productData.images || []).map((image) => [
            image.angle as Angle,
            image,
          ])
        );
        return (
          <Form onSubmit={onStepNext}>
            {angles.map((angle) => {
              const image = imageMap.get(angle);
              return (
                <ImagePicker
                  productId={defaultValues._id!}
                  key={image ? image._id : `product-image-${angle}`}
                  angle={angle}
                  image={image}
                />
              );
            })}
            <div className="flex w-full justify-between mt-4">
              <button
                onClick={onStepPrevious}
                type="button"
                className="bg-gray-900 px-3 py-2 rounded-md text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous Step
              </button>
            </div>
          </Form>
        );
      }
      default:
        return <div>Invalid step</div>;
    }
  } else {
    return (
      <BasicInformationProductForm
        errors={validationErrors}
        onInputCheckChange={handleInputCheckChange}
        defaultValues={defaultValues as Product}
        isLoading={isLoading}
        isEditing={isEditing}
        onStepNext={onStepNext}
      />
    );
  }
};
export default ProductForm;
