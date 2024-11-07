import ActivityType from "../enums/ActivityType";
import { ExtendedFilterParams } from "../utils/http";
import TimeOption from "../enums/TimeOption";
import {
  ActivityOptions,
  getDateRanges,
} from "../constants/dropdownOptions";
export type ActivityFilterParams = {
  timing: TimeOption;
  adminId?: string;
  activityType?: ActivityType[];
  startDate: Date;
  endDate: Date;
};
export const defaultFilterParams: ExtendedFilterParams<ActivityFilterParams> = {
  currentPage: 1,
  searchTerm: "",
  itemLimit: 10,
  timing: TimeOption.ALL_THE_TIME,
  activityType: ActivityOptions as ActivityType[],
  startDate: getDateRanges(TimeOption.ALL_THE_TIME).start,
  endDate: getDateRanges(TimeOption.ALL_THE_TIME).end,
};
