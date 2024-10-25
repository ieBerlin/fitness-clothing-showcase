import React from 'react';

interface ActionButtonProps {
  isLoading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  isLoading = false,
  onClick,
  type = "button",
  children,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`uppercase tracking-wide font-bold px-6 py-3 text-white transition-colors duration-300 rounded ${
        isLoading
          ? "bg-gray-700 text-gray-300 cursor-not-allowed"
          : "bg-black hover:bg-gray-900 active:bg-gray-800 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
      }`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className="w-5 h-5 mr-2 animate-spin text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeOpacity="0.25"
            />
            <path d="M4 12a8 8 0 1 1 16 0" stroke="currentColor" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default ActionButton;
