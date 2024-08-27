import { FC, FormEvent, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import {
  Availability,
  ErrorResponse,
  Product,
  Season,
  SuccessResponse,
} from "../types/product.types";
import { useMutation } from "@tanstack/react-query";
import ProductForm from "../components/ProductForm";
import { useNavigate } from "react-router-dom";
import { steps } from "../types/component.types";
import { createProduct } from "../utils/authUtils";
import ErrorDisplay from "../components/ErrorDisplay";

const AddProductPage: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Product>>({});
  const { mutate, isPending, isError, error } = useMutation<
    SuccessResponse,
    ErrorResponse,
    Product
  >({
    mutationKey: ["product"],
    mutationFn: createProduct,
    onError: (errors) => {
      console.log(errors);
    },
    onSuccess: (response) => {
      console.log(response);
      const productId = (response.data.product as Product)._id;
      return navigate(`/products/${productId}/edit`, {
        state: { step: steps[1] },
      });
    },
  });
  const handleCreateProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const updatedProductData: Partial<Product> = {
      productName: fd.get("product-name") as string,
      productDescription: fd.get("product-description") as string,
      woolPercentage: +(fd.get("product-wool-percentage") || 0),
      price: +(fd.get("product-price") || 0),
      releaseDate: new Date(fd.get("product-release-date") as string),
      isUnisex: fd.get("product-unisex") === "true",
      availability: fd.get("product-availability") as Availability,
      season: (fd.getAll("product-season") as string[]).map(
        (season) => season.toUpperCase() as Season
      ),
      colors: formData?.colors || [],
    };

    setFormData(updatedProductData);
    mutate(updatedProductData as Product);
  };
  if (isError) {
    return (
      <div className="space-y-4">
        <ErrorDisplay error={error} />
      </div>
    );
  }
  return (
    <PageTemplate title="Add Product Details">
      <ProductForm
        isLoading={isPending}
        currentStepId={steps[0].id}
        productData={formData}
        onProductDataChange={setFormData}
        onStepNext={handleCreateProduct}
      />
    </PageTemplate>
  );
};
export default AddProductPage;
