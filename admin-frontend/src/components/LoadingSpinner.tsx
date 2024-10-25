import { FC } from "react";

const LoadingSpinner: FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black border-solid"></div>
      <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider">
        {title}
      </h2>
    </div>
  );
};

export default LoadingSpinner;
