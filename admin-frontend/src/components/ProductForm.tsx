import { FC, FormEvent } from "react";
import { Form } from "react-router-dom";
import ProductColors from "../components/ProductColors";
import { Availability, Image, Product, Season } from "../types/product.types";
import BasicInformationProductForm from "./BasicInformationProductForm";
import ImagePicker from "./ImagePicker";

interface ProductFormProps {
  isLoading?: boolean;
  isEditing?: boolean;
  productData: Partial<Product>;
  onProductDataChange: (updatedData: Partial<Product>) => void;
  currentStepId: string;
  onStepPrevious?: () => void;
  onStepNext: (e: FormEvent<HTMLFormElement>) => void;
}

const ProductForm: FC<ProductFormProps> = ({
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
        const images: Image[] = defaultValues.images || [];
        const angles: string[] = ["back", "front", "side", "top", "bottom"];

        return (
          <Form onSubmit={onStepNext}>
            {angles.map((angle) => (
              <ImagePicker
                key={`product-image-${angle}`}
                label={`${angle.charAt(0).toUpperCase() + angle.slice(1)} View`}
                image={images.find((image) => image.angle === angle)}
              />
            ))}
          </Form>
        );
      }
      default:
        return <div>Invalid step</div>;
    }
  } else {
    return (
      <BasicInformationProductForm
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
