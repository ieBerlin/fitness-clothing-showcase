import { API_URL, getData, ExtendedFilterParams } from "./http";
import {
  AdminProfileResponse,
  AdminResponse,
  DataResponse,
  ProductResponse,
  SectionResponse,
  StatisticsResponse,
} from "../types/response";
import Product from "../models/Product";
import Section from "../models/Section";
import Activity from "../models/Activity";
import { ActivityFilterParams } from "../pages/AdminActivity";
export interface FetchProductParams {
  productId: string;
}

export const fetchProducts = async <ItemsResponse>(params: {
  currentPage?: number;
  itemLimit?: number;
  searchTerm?: string;
  availability?: string[];
  price?: string;
}) => {
  const {
    currentPage = 1,
    itemLimit,
    searchTerm,
    availability,
    price,
  } = params;
  const url = new URL(`${API_URL}product`);
  url.searchParams.append("page", currentPage.toString());
  if (itemLimit !== undefined) {
    url.searchParams.append("limit", itemLimit.toString());
  }

  if (
    searchTerm !== undefined &&
    searchTerm !== "" &&
    searchTerm?.trim() !== ""
  ) {
    url.searchParams.append("search", searchTerm.trim());
  }
  if (availability !== undefined && availability.length > 0) {
    url.searchParams.append("availability", JSON.stringify(availability));
  }
  if (price !== undefined) {
    url.searchParams.append("price", price);
  }
  // console.log(Object.fromEntries(url.searchParams.entries()));
  return getData<ItemsResponse>({
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
    method: "DELETE",
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
export const fetchSections = async <ItemsResponse>({
  currentPage = 1,
  itemLimit,
  searchTerm,
  availability,
  price,
}: {
  currentPage?: number;
  itemLimit?: number;
  searchTerm?: string;
  availability?: string[];
  price?: string;
}) => {
  const url = new URL(`${API_URL}section`);
  if (currentPage !== undefined) {
    url.searchParams.append("page", currentPage.toString());
  }
  if (itemLimit !== undefined) {
    url.searchParams.append("limit", itemLimit.toString());
  }
  if (
    searchTerm !== undefined &&
    searchTerm !== "" &&
    searchTerm?.trim() !== ""
  ) {
    url.searchParams.append("search", searchTerm.trim());
  }
  if (availability !== undefined && availability.length > 0) {
    url.searchParams.append("availability", JSON.stringify(availability));
  }
  if (price !== undefined) {
    url.searchParams.append("price", price);
  }
  return getData<ItemsResponse>({
    url: url.toString(),
    method: "GET",
  });
};

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
export const fetchActivities = async <ItemsResponse>(
  params: ExtendedFilterParams<ActivityFilterParams>
) => {
  const {
    adminId,
    activityType,
    entityType,
    startDate,
    endDate,
    currentPage = 1,
    itemLimit = 10,
    searchTerm,
  } = params;
  const urlParams = new URLSearchParams();
  if (adminId) {
    urlParams.append("adminId", adminId);
  }
  if (
    searchTerm !== undefined &&
    searchTerm !== "" &&
    searchTerm?.trim() !== ""
  ) {
    urlParams.append("search", searchTerm.trim());
  }
  if (activityType && activityType.length > 0) {
    activityType.forEach((type) => urlParams.append("activityType", type));
  }
  if (entityType && entityType.length > 0) {
    entityType.forEach((type) => urlParams.append("entityType", type));
  }
  if (startDate) {
    const start = new Date(startDate);
    if (!isNaN(start.getTime())) {
      urlParams.append("startDate", start.toISOString());
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (!isNaN(end.getTime())) {
      urlParams.append("endDate", end.toISOString());
    }
  }

  urlParams.append("page", currentPage.toString());
  urlParams.append("limit", itemLimit.toString());

  const url = new URL(`${API_URL}activity`);
  url.search = urlParams.toString();
  return getData<ItemsResponse>({
    url: url.toString(),
  });
};
export const fetchMyActivities = async ({
  currentPage = 1,
  itemLimit = 10,
}: {
  currentPage?: number;
  itemLimit?: number;
}) => {
  const params = new URLSearchParams();

  params.append("page", currentPage.toString());
  params.append("limit", itemLimit.toString());

  const url = new URL(`${API_URL}activity/my-activities`);
  url.search = params.toString();

  return getData<DataResponse<Activity>>({
    url: url.toString(),
  });
};
export const fetchMyBasicInformations = async () => {
  const url = new URL(`${API_URL}activity/my-activities`);

  return getData<DataResponse<Activity>>({
    url: url.toString(),
  });
};
export const fetchStatistics = async () =>
  getData<StatisticsResponse>({
    url: new URL(`${API_URL}statistics`).toString(),
  });
export const fetchMyProfile = async () =>
  getData<AdminProfileResponse>({
    url: new URL(`${API_URL}auth/my-profile`).toString(),
  });
export const fetchAdmin = async (adminId: string) =>
  getData<AdminResponse>({
    url: new URL(`${API_URL}auth/${adminId}`).toString(),
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
export const storeAdminPicture = async (formData: FormData) =>
  getData<null>({
    url: new URL(`${API_URL}image/upload/admin`).toString(),
    method: "POST",
    body: formData,
  });
export const deleteAdminPicture = async () =>
  getData<null>({
    url: new URL(`${API_URL}image/upload/admin`).toString(),
    method: "DELETE",
  });
export const updatePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) =>
  getData<null>({
    url: new URL(`${API_URL}auth/update-password`).toString(),
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
export const getAdminPicture = async () =>
  getData<string>({
    url: new URL(`${API_URL}image`).toString(),
    method: "GET",
  });
