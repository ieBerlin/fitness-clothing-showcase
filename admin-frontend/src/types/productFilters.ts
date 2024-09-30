import Availability from "../enums/Availability";
import PriceOptions from "../enums/PriceOptions";
import { ExtendedFilterParams } from "../utils/http";
export type ProductFilterParams = {
  availability: Availability[];
  price: PriceOptions;
};

export const defaultFilterParams: ExtendedFilterParams<ProductFilterParams> = {
  currentPage: 1,
  searchTerm: "",
  itemLimit: 10,
  availability: Object.values(Availability) as Availability[],
  price: PriceOptions.ALL,
};
