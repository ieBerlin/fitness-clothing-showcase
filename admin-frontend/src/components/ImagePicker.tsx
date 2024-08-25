import { FC, useRef, useState } from "react";
import { ImagePickerProps } from "../types/component.types";
import { useMutation } from "@tanstack/react-query";
import { storeImage } from "../utils/http";

const ImagePicker: FC<ImagePickerProps> = ({ label, image }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(image?.pathname ?? null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
//   const { mutate } = useMutation({
//     mutationKey: ["product"],
//     mutationFn: storeImage,
//     onSuccess: () => {
//       // Handle successful image upload
//       console.log("Image uploaded successfully.");
//     },
//     onError: (error) => {
//       // Handle image upload errors
//       console.error("Image upload failed:", error);
//     },
//   });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file); // Save the selected file
    }
  };

  const handleUpdateImage = () => {
    if (selectedFile && image?.angle) {
      // Use mutation to upload image
    //   mutate(productId, image.angle, selectedFile);
    }
  };

  const triggerFileInput = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setAvatar(null);
    // Handle image removal logic here
    console.log("Image removed.");
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div
        className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition-colors"
        onClick={triggerFileInput}
      >
        {avatar ? (
          <>
            <img
              src={typeof avatar === "string" ? avatar : ""}
              alt="Selected"
              className="object-contain h-40 w-full mb-2 rounded-md"
            />
            <div className="flex flex-row gap-2 mb-2">
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleUpdateImage}
              >
                Change Image
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={handleRemoveImage}
              >
                Remove Image
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
              onClick={triggerFileInput}
            >
              Upload Image
            </button>
          </div>
        )}
      </div>
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
