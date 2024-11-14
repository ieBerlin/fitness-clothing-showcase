import { EyeSlashIcon } from "@heroicons/react/16/solid";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { closeModal, updateImageIndex } from "../features/modal";
import { useDispatch } from "react-redux";
import { RootState } from "../store/modalStore";
import { imageUrl } from "../utils/http";

function Modal() {
  const { isOpen, currentImage, currentImageIndex, totalImagesCount } =
    useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();
  if (!isOpen) {
    return null;
  }
  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      dispatch(updateImageIndex(currentImageIndex - 1));
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < totalImagesCount - 1) {
      dispatch(updateImageIndex(currentImageIndex + 1));
    }
  };

  const previousButtonDisabled = currentImageIndex === 0;
  const nextButtonDisabled = currentImageIndex === totalImagesCount - 1;
  return (
    <dialog
      open
      className="fixed inset-0 z-[9999] flex justify-center items-center w-full h-full backdrop-blur-lg bg-transparent"
    >
      <div className="relative w-[95%] h-[95%] bg-transparent px-6 overflow-auto">
        <button
          onClick={() => dispatch(closeModal())}
          className="absolute top-4 right-4 flex items-center justify-center p-2 rounded-full bg-blue-600 hover:bg-blue-500 duration-200 hover:scale-110 z-10"
          aria-label="Toggle Image Overview"
        >
          <EyeSlashIcon className="h-5 w-5 text-white" />
        </button>

        <div className="flex flex-row justify-center items-center gap-4 h-full">
          <button
            aria-label="Previous"
            className={`p-2 rounded-full ${
              previousButtonDisabled
                ? "bg-[#e7e7e7] cursor-not-allowed"
                : "bg-black"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition`}
            disabled={previousButtonDisabled}
            onClick={handlePreviousImage}
          >
            <FaChevronLeft
              className={`w-6 h-6 ${
                previousButtonDisabled ? "text-gray-600" : "text-white"
              }`}
            />
          </button>

          <img
            src={
              currentImage.pathname === "/NoImageAvailable.jpg"
                ? currentImage.pathname
                : `${imageUrl}${currentImage.pathname}`
            }
            className="h-full max-w-[90%] object-cover"
            alt="Product Image"
          />

          <button
            aria-label="Next"
            className={`p-2 rounded-full ${
              nextButtonDisabled
                ? "bg-[#e7e7e7] cursor-not-allowed"
                : "bg-black"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition`}
            disabled={nextButtonDisabled}
            onClick={handleNextImage}
          >
            <FaChevronRight
              className={`w-6 h-6 ${
                nextButtonDisabled ? "text-gray-600" : "text-white"
              }`}
            />
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default Modal;
