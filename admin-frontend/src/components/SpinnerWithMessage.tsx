import { FC } from "react";

interface SpinnerWithMessageProps {
  message: string;
}

const SpinnerWithMessage: FC<SpinnerWithMessageProps> = ({ message }) => {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <svg
        className="w-5 h-5 text-gray-400 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default SpinnerWithMessage;
