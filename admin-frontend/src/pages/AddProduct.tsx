import { FC, FormEvent, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import {
  Availability,
  Product,
  ProductResponse,
  Season,
} from "../types/product.types";
import { useMutation } from "@tanstack/react-query";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../utils/http";
import { useNavigate } from "react-router-dom";
import { ValidationError } from "../types/validation-error.types";
import { steps } from "../types/component.types";

const AddProductPage: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Product>>({});
  const { mutate, isPending } = useMutation<
    ProductResponse,
    ValidationError[],
    Product
  >({
    mutationKey: ["product"],
    mutationFn: createProduct,
    onError: (errors) => {
      console.log(errors);
    },
    onSuccess: (data) => {
      return navigate(`/products/${data.product._id}/edit`, {
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
