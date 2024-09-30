import { getDateRanges } from "../constants/dropdownOptions";
import TimeOption from "../enums/TimeOption";
import { ExtendedFilterParams } from "../utils/http";

export type NotificationFilterParams = {
  timing: TimeOption;
  startDate: Date;
  endDate: Date;
};
export const defaultFilterParams: ExtendedFilterParams<NotificationFilterParams> =
  {
    currentPage: 1,
    searchTerm: "",
    itemLimit: 10,
    timing: TimeOption.ALL_THE_TIME,
    startDate: getDateRanges(TimeOption.ALL_THE_TIME).start,
    endDate: getDateRanges(TimeOption.ALL_THE_TIME).end,
  };
