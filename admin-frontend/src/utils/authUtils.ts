import { API_URL, getData } from "./http";
import {
  ProductResponse,
  SectionResponse,
  SectionsResponse,
} from "../types/response";
import Product from "../models/Product";
import Section from "../models/Section";
export interface FetchProductParams {
  productId: string;
}

export const fetchProducts = async <ProductsResponse>({
  page = 1,
  limit,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const url = new URL(`${API_URL}product`);
  if (page !== undefined) {
    url.searchParams.append("page", page.toString());
  }
  if (limit !== undefined) {
    url.searchParams.append("limit", limit.toString());
  }
  if (search !== undefined && search !== "" && search?.trim() !== "") {
    url.searchParams.append("search", search.trim());
  }
  return getData<ProductsResponse>({
    url: url.toString(),
  });
};
export const fetchProduct = async (productId: string) =>
  getData<ProductResponse>({
    url: new URL(`${API_URL}product/${productId}`).toString(),
    method: "GET",
  });
export const deleteProduct = async (productId: string) =>
  getData<null>({
    url: new URL(`${API_URL}product/${productId}`).toString(),
  });
export const removeProductFromSection = async ({
  sectionId,
  productId,
}: {
  sectionId: string;
  productId: string;
}) =>
  getData<SectionResponse>({
    url: new URL(`${API_URL}section/${sectionId}/${productId}`).toString(),
    method: "DELETE",
  });
export const fetchProductsCount = async () =>
  getData<boolean>({
    url: new URL(`${API_URL}product/count-products`).toString(),
    method: "DELETE",
  });
export const fetchSections = async () =>
  getData<SectionsResponse>({
    url: new URL(`${API_URL}section`).toString(),
    method: "GET",
  });

export const addItemsToSection = async ({
  sectionId,
  items,
}: {
  sectionId: string;
  items: Product[];
}) =>
  getData<Section>({
    url: new URL(`${API_URL}section/${sectionId}`).toString(),
    method: "PUT",
    body: JSON.stringify({ items }),
  });
export const editProduct = async (product: Product) =>
  getData<ProductResponse>({
    url: new URL(`${API_URL}product/${product._id}`).toString(),
    method: "PUT",
    body: JSON.stringify(product),
  });
export const createProduct = async (product: Product) =>
  getData<ProductResponse>({
    url: new URL(`${API_URL}product`).toString(),
    method: "POST",
    body: JSON.stringify(product),
  });
export const storeImage = async (formData: FormData) =>
  getData<null>({
    url: new URL(
      `${API_URL}image/upload/product/${formData.get(
        "imageAngle"
      )}/${formData.get("productId")}`
    ).toString(),
    method: "POST",
    body: formData,
  });
