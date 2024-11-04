import { ExtendedFilterParams } from "../utils/http";
import TimeOption from "../enums/TimeOption";
import { getDateRanges } from "../constants/dropdownOptions";
import ActivityType from "../enums/ActivityType";
export type ActivityFilterParams = {
  timing: TimeOption;
  startDate: Date;
  endDate: Date;
  activityType: ActivityType[];
};
export const defaultFilterParams: ExtendedFilterParams<ActivityFilterParams> = {
  currentPage: 1,
  searchTerm: "",
  itemLimit: 10,
  timing: TimeOption.ALL_THE_TIME,
  startDate: getDateRanges(TimeOption.ALL_THE_TIME).start,
  endDate: getDateRanges(TimeOption.ALL_THE_TIME).end,
  activityType: Object.values(ActivityType),
};
