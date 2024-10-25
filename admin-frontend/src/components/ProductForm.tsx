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
import ActionButton from "./ActionButton";

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
          <Form
            onSubmit={onStepNext}
            className="text-gray-800 bg-white p-8 border border-gray-200"
          >
            <div className="flex w-full justify-between mb-4">
              <ActionButton
                onClick={onStepPrevious}
                isLoading={isLoading}
                disabled={isLoading}
                type="button"
              >
                Previous Step
              </ActionButton>
              <ActionButton
                isLoading={isLoading}
                disabled={isLoading}
                type="submit"
              >
                Next Step
              </ActionButton>
            </div>
            <ProductColors
              productColors={defaultValues.colors}
              isUnisex={defaultValues.isUnisex ?? false}
            />
          </Form>
        );

      case "image-upload": {
        const angles: Angle[] = ["back", "front", "side", "top", "bottom"];
        const imageMap = new Map<Angle, Image>(
          (productData.images || []).map((image) => [
            image.angle as Angle,
            image,
          ])
        );
        return (
          <Form
            onSubmit={onStepNext}
            className="text-gray-800 bg-white p-8 border border-gray-200"
          >
            <div className="flex w-full justify-between mb-4">
              <ActionButton
                onClick={onStepPrevious}
                isLoading={isLoading}
                disabled={isLoading}
                type="button"
              >
                Previous Step
              </ActionButton>
            </div>
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
