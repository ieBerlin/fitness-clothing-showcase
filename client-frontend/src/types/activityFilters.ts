import ActivityType from "../enums/ActivityType";
import EntityType from "../enums/EntityType";
import { ExtendedFilterParams } from "../utils/http";
import TimeOption from "../enums/TimeOption";
import {
  ActivityOptions,
  EntityOptions,
  getDateRanges,
} from "../constants/dropdownOptions";
export type ActivityFilterParams = {
  timing: TimeOption;
  adminId?: string;
  activityType?: ActivityType[];
  entityType?: EntityType[];
  startDate: Date;
  endDate: Date;
};
export const defaultFilterParams: ExtendedFilterParams<ActivityFilterParams> = {
  currentPage: 1,
  searchTerm: "",
  itemLimit: 10,
  timing: TimeOption.ALL_THE_TIME,
  activityType: ActivityOptions as ActivityType[],
  entityType: EntityOptions as EntityType[],
  startDate: getDateRanges(TimeOption.ALL_THE_TIME).start,
  endDate: getDateRanges(TimeOption.ALL_THE_TIME).end,
};
