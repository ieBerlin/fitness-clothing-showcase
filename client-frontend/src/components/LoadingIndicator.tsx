import { FC } from "react";

const LoadingIndicator: FC<{ dimensions?: string }> = ({
  dimensions = "h-16 w-16",
}) => {
  return (
    <div
      className={`animate-spin rounded-full ${dimensions} border-t-4 border-black border-solid`}
    ></div>
  );
};
export default LoadingIndicator;
