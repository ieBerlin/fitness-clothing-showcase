import React from "react";

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isActive: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  ...props
}) => {
  return (
    <button
      className={`px-5 border font-medium text-sm uppercase py-2 rounded-full transition duration-300 ease-in-out ${
        isActive
          ? "bg-black text-white scale-105 border-transparent"
          : "bg-white text-black hover:bg-black hover:text-white border-black"
      }`}
      {...props}
    >
      {label}
    </button>
  );
};

export default TabButton;
