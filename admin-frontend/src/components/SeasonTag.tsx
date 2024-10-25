import React from "react";
import Season from "../enums/Season";

interface SeasonTagProps {
  season: Season;
}

const SeasonTag: React.FC<SeasonTagProps> = ({ season }) => {
  const seasonStyles = {
    WINTER: "bg-gradient-to-r from-blue-500 to-blue-700",
    SUMMER: "bg-gradient-to-r from-yellow-500 to-yellow-700",
    AUTUMN: "bg-gradient-to-r from-orange-500 to-red-600",
    SPRING: "bg-gradient-to-r from-green-500 to-green-700",
  };

  return (
    <span
      className={`font-semibold hover:scale-105 text-white px-3 py-1 rounded-lg mr-3 transition-transform transform ${
        seasonStyles[season] || seasonStyles["SPRING"]
      }`}
    >
      {season}
    </span>
  );
};

export default SeasonTag;
