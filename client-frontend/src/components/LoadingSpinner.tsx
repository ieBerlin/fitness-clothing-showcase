import { FC } from "react";
import LoadingIndicator from "./LoadingIndicator";

const LoadingSpinner: FC<{ title?: string; dimensions?: string }> = ({
  title,
  dimensions = "h-16 w-16",
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
      <LoadingIndicator dimensions={dimensions} />
      {title && (
        <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider">
          {title}
        </h2>
      )}
    </div>
  );
};

export default LoadingSpinner;
