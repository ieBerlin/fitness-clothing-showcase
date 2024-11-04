import { FC, FormEvent, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import { useMutation } from "@tanstack/react-query";
import ProductForm from "../components/ProductForm";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../utils/authUtils";
import ErrorAlert from "../components/ErrorAlert";
import { ErrorResponse, ProductResponse } from "../types/response";
import Product from "../models/Product";
import Availability from "../enums/Availability";
import Season from "../enums/Season";
import Gender from "../enums/Gender";
interface Step {
  id: string;
  label: string;
}

const steps: Step[] = [
  { id: "basic-info", label: "Basic Product Information" },
  { id: "color-selection", label: "Chosen Colors" },
  { id: "image-upload", label: "Images" },
];
const AddProductPage: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Product>>({});
  const { mutate, isPending, isError, error } = useMutation<
    ProductResponse,
    ErrorResponse,
    Product
  >({
    mutationKey: ["product"],
    mutationFn: createProduct,
    onMutate: (vars) => console.log(vars),
    onSuccess: (product) => {
      const productId = product._id;
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
      gender: fd.get("gender") as Gender,
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
      {isError && !isPending && (
        <div className="bg-white borde border-gray-200">
          <ErrorAlert error={error} />
        </div>
      )}
    </PageTemplate>
  );
};
export default AddProductPage;
