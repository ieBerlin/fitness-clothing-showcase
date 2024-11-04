import React, { useEffect, useState } from "react";
import { CameraIcon, XCircleIcon } from "@heroicons/react/24/outline";
import PageTemplate from "../components/PageTemplate";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteAdminPicture,
  getAdminPicture,
  storeAdminPicture,
} from "../utils/authUtils";
import { ErrorResponse } from "../types/response";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { useDispatch } from "react-redux";
import { openConfirmationModal } from "../features/modal";
import { queryClient, SERVER_URL } from "../utils/http";
const UpdateProfilePicturePage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    data: adminProfilePicture,
    isFetching: isFetchingProfilePicture,
    isError: hasFetchError,
    error: fetchError,
  } = useQuery<string, ErrorResponse>({
    queryKey: ["admin-profile-picture"],
    queryFn: getAdminPicture,
  });

  const { isPending: isUploadingPicture, mutate: uploadPictureMutation } =
    useMutation<null, ErrorResponse, FormData>({
      mutationKey: ["admin-profile-picture"],
      mutationFn: storeAdminPicture,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-profile-picture"] });
        dispatch(
          openConfirmationModal({
            message: "Your profile picture has been updated successfully!",
          })
        );
      },
      onError: () => {
        dispatch(
          openConfirmationModal({
            message: "Failed to update your profile picture!",
          })
        );
      },
    });
  const { isPending: isDeletingPicture, mutate: deletePictureMutation } =
    useMutation<null, ErrorResponse, null>({
      mutationKey: ["admin-profile-picture"],
      mutationFn: deleteAdminPicture,
      onSuccess: () => {
        setProfilePicture(null);
        queryClient.invalidateQueries({ queryKey: ["admin-profile-picture"] });
        dispatch(
          openConfirmationModal({
            message: "Your profile picture has been deleted successfully!",
          })
        );
      },
      onError: () => {
        dispatch(
          openConfirmationModal({
            message: "Failed to delete your profile picture!",
          })
        );
      },
    });
  const isProcessing = isDeletingPicture || isUploadingPicture;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<
    string | ArrayBuffer | null
  >(null);
  useEffect(() => {
    if (adminProfilePicture) {
      setProfilePicture(
        `${SERVER_URL}/public/uploads/admin/${adminProfilePicture}`
      );
    }
  }, [adminProfilePicture]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      const fd = new FormData();
      fd.append("image", selectedFile);
      uploadPictureMutation(fd);
    }
  };
  // handleDeletePicture
  const handleDeleteSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (adminProfilePicture) {
      deletePictureMutation(null);
    }
  };

  const handleImageRemoval = () => {
    setProfilePicture(null);
    setSelectedFile(null);
  };
  if (isFetchingProfilePicture) {
    return <LoadingSpinner title="Loading..." />;
  }
  if (hasFetchError && fetchError.statusCode === 500) {
    return (
      <div className="flex items-center justify-center w-full py-10 flex-col gap-2">
        <h1 className="text-4xl font-bold mb-4">Server Error</h1>
        <p className="text-lg mb-4">Failed to fetch admin picture</p>
        <ErrorAlert error={fetchError} />
      </div>
    );
  }
  return (
    <PageTemplate title="Update Profile Picture">
      <div className="bg-white h-full border border-gray-300 p-8 w-full flex flex-col">
        <form
          onSubmit={handleUploadSubmit}
          className="flex flex-col items-center flex-grow"
        >
          <div className=" flex-grow flex items-center justify-center">
            <div className="relative w-48 h-48">
              <img
                src={(profilePicture as string) || "/default-profile.jpg"}
                alt="Profile"
                className="max-h-[200px] w-full h-full rounded-full border-4 border-gray-300 shadow-lg object-cover transition-transform duration-300 hover:scale-110"
              />
              {profilePicture && !isProcessing && (
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 transition-colors"
                  onClick={handleImageRemoval}
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              )}
              {!isProcessing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors flex items-center">
                  <CameraIcon className="w-6 h-6" />
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-2 items-end justify-center w-full mt-4 ">
            <button
              type="submit"
              className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow-md transition-all duration-300 ${
                isProcessing
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isProcessing}
            >
              {isProcessing ? "Uploading..." : "Upload"}
            </button>
            {!isProcessing && adminProfilePicture && (
              <button
                onClick={handleDeleteSubmit}
                type="button"
                className="w-full py-2 px-4 text-white font-semibold rounded-md shadow-md transition-all duration-300 bg-red-600 hover:bg-red-700"
                disabled={isProcessing}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </PageTemplate>
  );
};

export default UpdateProfilePicturePage;
