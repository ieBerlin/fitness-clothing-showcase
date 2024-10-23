import { useDispatch } from "react-redux";
import { closeModal } from "../features/modal";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  isLoading?: boolean;
  onConfirm: () => void;
}

interface CancelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function ActionButton({
  label = "Save",
  isLoading = false,
  onConfirm,
}: ActionButtonProps) {
  return (
    <button
      onClick={onConfirm}
      className={`px-4 py-2 text-lg font-semibold tracking-wider uppercase transition-all duration-300 border-2 border-black 
        ${isLoading 
          ? "bg-white text-gray-500 cursor-not-allowed opacity-50" 
          : "bg-black text-white hover:bg-white hover:text-black hover:shadow-lg transform hover:scale-105"
        } 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : label}
    </button>
  );
}

export function CancelButton({ isLoading = false }: CancelButtonProps) {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(closeModal())}
      className={`px-4 py-2 text-lg font-semibold tracking-wider uppercase transition-all duration-300 border-2 border-black 
        ${isLoading 
          ? "bg-white text-gray-500 cursor-not-allowed opacity-50" 
          : "bg-white text-black hover:bg-black hover:text-white hover:shadow-lg transform hover:scale-105"
        } 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
      disabled={isLoading}
    >
      Cancel
    </button>
  );
}
