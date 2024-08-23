import { useDispatch } from "react-redux";
import { closeModal } from "../features/modal";
interface ActionButtonProps {
    label?: string;
    isLoading?: boolean;
    onConfirm: () => void;
}

interface CancelButtonProps {
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
            className={`px-2 py-1 rounded-md font-medium text-md lg:text-lg ${isLoading
                    ? "bg-gray-300 text-gray-700"
                    : "bg-orange-500 hover:bg-orange-400 text-white"
                }`}
            disabled={isLoading} // Disable button when loading
        >
            {label}
        </button>
    );
}

export function CancelButton({ isLoading = false }: CancelButtonProps) {
    const dispatch = useDispatch();

    return (
        <button
            onClick={() => dispatch(closeModal())}
            className={`px-2 py-1 rounded-md font-medium text-md lg:text-lg ${isLoading
                    ? "bg-gray-300 text-gray-700"
                    : "bg-gray-500 hover:bg-gray-400 text-white"
                }`}
            disabled={isLoading} // Disable button when loading
        >
            Cancel
        </button>
    );
}
