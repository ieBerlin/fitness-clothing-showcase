import { FC, useRef, useState } from "react";
import { ImagePickerProps } from "../types/component.types";
import { useMutation } from "@tanstack/react-query";
import { SERVER_URL, queryClient } from "../utils/http";
import { storeImage } from "../utils/authUtils";
import { ErrorResponse } from "react-router-dom";
import { SuccessResponse } from "../types/product.types";
import LoadingSpinner from "./LoadingSpinner";

const ImagePicker: FC<ImagePickerProps> = ({ productId, angle, image }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(
    image?.pathname
      ? `${SERVER_URL}/public/uploads/product/${image?.pathname}`
      : null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { mutate, isPending } = useMutation<
    SuccessResponse,
    ErrorResponse,
    FormData
  >({
    mutationKey: ["images"],
    mutationFn: storeImage,
    onMutate: () => {
      setIsUploading(true);
    },
    onSuccess: () => {
      console.log("Image uploaded successfully.");
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
    onError: (error) => {
      console.error("Image upload failed:", error);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const handleUpdateImage = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("imageAngle", angle);
      formData.append("productId", productId.toString());

      mutate(formData);
    }
  };

  const triggerFileInput = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setAvatar(null);
    setSelectedFile(null);
    console.log("Image removed.");
  };

  const avatarSrc = typeof avatar === "string" ? avatar : "";

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {`${angle.charAt(0).toUpperCase() + angle.slice(1)} View`}
      </label>
      {isPending ? (
        <div className="flex items-center justify-center w-full py-10 flex-col gap-2">
          <LoadingSpinner
            fill="blue-600"
            text="gray-400"
            dimension="w-16 h-16"
          />
          <h2 className="text-gray-500 font-semibold">Loading...</h2>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition-colors ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={!isUploading ? triggerFileInput : undefined}
        >
          {avatar ? (
            <>
              <img
                src={avatarSrc}
                alt="Selected"
                className="object-contain h-40 w-full mb-2 rounded-md"
              />
              <div className="flex flex-row gap-2 mb-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                  disabled={isUploading}
                  aria-label="Change Image"
                >
                  Change Image
                </button>

                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  disabled={isUploading}
                  aria-label="Remove Image"
                >
                  Remove Image
                </button>

                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateImage();
                  }}
                  disabled={isUploading}
                  aria-label="Upload Image"
                >
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-500">
              <p className="mb-2">Click to upload or drag & drop an image</p>
              <p className="text-xs text-gray-400">
                Supported formats: JPG, PNG, GIF
              </p>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}
                disabled={isUploading}
                aria-label="Upload Image"
              >
                Upload Image
              </button>
            </div>
          )}
        </div>
      )}
      <input
        ref={imageRef}
        type="file"
        name="image"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImagePicker;
