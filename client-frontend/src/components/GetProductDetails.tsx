import { useQuery } from "@tanstack/react-query";
import Product from "../models/Product";
import { ErrorResponse } from "../types/response";
import { productQueryKey } from "../constants/queryKeys";
import { fetchProduct } from "../utils/authUtils";
import { FC } from "react";
import ProductCard from "./ProductCard";
import LoadingIndicator from "./LoadingIndicator";

const GetProductDetails: FC<{
  productId: string;
}> = ({ productId }) => {
  const {
    data: productData,
    isError,
    isPending,
  } = useQuery<Product, ErrorResponse>({
    queryKey: [...productQueryKey, productId],
    queryFn: () => fetchProduct(productId),
  });
  if (isPending) {
    return (
      <div className="w=full flex justify-center items-center h-60 bg-gray-50 overflow-hidden transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 ease-in-out">
        <LoadingIndicator />
      </div>
    );
  }
  if (productData && productData._id && !isError) {
    return <ProductCard product={productData} />;
  }
  return <div></div>;
};
export default GetProductDetails;
