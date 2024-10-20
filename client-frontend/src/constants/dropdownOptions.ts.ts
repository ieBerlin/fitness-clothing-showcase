import ActivityType from "../enums/ActivityType";
import EntityType from "../enums/EntityType";
import TimeOption from "../enums/TimeOption";
import Availability from "../enums/Availability";
import PriceOptions from "../enums/PriceOptions";

export const paginationOptions = [10, 20, 50, 100];
export const ActivityOptions = Object.values(ActivityType);
export const EntityOptions = Object.values(EntityType);
export const getDateRanges = (time: TimeOption) => {
  const now = new Date();
  const startOfDay = (date: Date) => new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = (date: Date) => new Date(date.setHours(23, 59, 59, 999));
  switch (time) {
    case TimeOption.ALL_THE_TIME:
      return {
        start: new Date(0),
        end: endOfDay(now),
      };
    case TimeOption.THIS_YEAR:
      return {
        start: startOfDay(new Date(now.getFullYear(), 0, 1)),
        end: endOfDay(new Date(now.getFullYear(), 11, 31)),
      };
    case TimeOption.LAST_30_DAYS:
      return {
        start: startOfDay(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)),
        end: endOfDay(now),
      };
    case TimeOption.LAST_7_DAYS:
      return {
        start: startOfDay(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
        end: endOfDay(now),
      };
  }
};

export const formattedAvailabilityOptions = Object.values(Availability).map(
  (value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " "),
    value,
  })
);

export const formattedPriceOptions = Object.values(PriceOptions).map(
  (value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " "),
    value,
  })
);