import { FC } from "react";
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  XMarkIcon,
  NoSymbolIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import Availability from "../enums/Availability";
const StyledAvailability: FC<{ status: Availability }> = ({ status }) => {
  switch (status) {
    case Availability.IN_STOCK:
      return (
        <div className="bg-emerald-100 border border-emerald-400 px-3 py-1 w-fit rounded-md flex flex-row items-center gap-1">
          <CheckIcon className="text-emerald-600 w-5 h-5" />
          <h2 className="text-emerald-600 font-semibold text-sm">In Stock</h2>
        </div>
      );

    case Availability.OUT_OF_STOCK:
      return (
        <div className="bg-red-100 border border-red-400 px-3 py-1 w-fit rounded-md flex flex-row items-center gap-1">
          <XMarkIcon className="text-red-600 w-5 h-5" />
          <h2 className="text-red-600 font-semibold text-sm">Out of Stock</h2>
        </div>
      );

    case Availability.DISCOUNTED:
      return (
        <div className="bg-amber-100 border border-amber-400 px-3 py-1 w-fit rounded-md flex flex-row items-center gap-1">
          <TagIcon className="text-amber-500 w-5 h-5" />
          <h2 className="text-amber-500 font-semibold text-sm">Discounted</h2>
        </div>
      );

    case Availability.COMING_SOON:
      return (
        <div className="bg-blue-100 border border-blue-400 px-3 py-1 w-fit rounded-md flex flex-row items-center gap-1">
          <ClockIcon className="text-blue-600 w-5 h-5" />
          <h2 className="text-blue-600 font-semibold text-sm">Coming Soon</h2>
        </div>
      );

    case Availability.OUT_OF_SEASON:
      return (
        <div className="bg-purple-100 border border-purple-400 px-3 py-1 w-fit rounded-md flex flex-row items-center gap-1">
          <CalendarIcon className="text-purple-600 w-5 h-5" />
          <h2 className="text-purple-600 font-semibold text-sm">
            Out of Season
          </h2>
        </div>
      );

    case Availability.UNAVAILABLE:
      return (
        <div className="bg-gray-100 border border-gray-400 px-3 py-1 w-fit rounded-md flex flex-row items-center gap-1">
          <NoSymbolIcon className="text-gray-600 w-5 h-5" />
          <h2 className="text-gray-600 font-semibold text-sm">Unavailable</h2>
        </div>
      );

    default:
      return null;
  }
};

export default StyledAvailability;
