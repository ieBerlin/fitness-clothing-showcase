import React, { useRef } from "react";
import TextInput from "./../components/TextInput";
import PageTemplate from "../components/PageTemplate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorResponse } from "../types/response";
import { openConfirmationModal } from "../features/modal";
import { useDispatch } from "react-redux";
import { fetchMyProfile, updateMyProfile } from "../utils/authUtils";
import { queryClient } from "../utils/http";
import { getQueryKey } from "../constants/queryKeys";

const UpdateDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const { data: admin } = useQuery({
    queryKey: getQueryKey("admins"),
    queryFn: fetchMyProfile,
  });
  const { mutate } = useMutation<null, ErrorResponse, string>({
    mutationKey: getQueryKey("admins"),
    mutationFn: updateMyProfile,
    onSuccess: () => {
      formRef.current?.reset();
      queryClient.invalidateQueries({ queryKey: getQueryKey("admins") });
      dispatch(
        openConfirmationModal({
          message: "Your details have been updated successfully!",
        })
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    mutate((fd.get("full-name") as string) || "");
  };

  return (
    <PageTemplate title="Update Admin Details">
      <div className="bg-white border border-gray-300 p-8 w-full max-w-full mx-auto mt-3">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4 text-gray-700"
        >
          <TextInput
            placeholder="Full Name"
            name="full-name"
            label="Full Name:"
            type="text"
            defaultValue={admin?.fullName}
          />
          <TextInput
            disabled
            readOnly
            placeholder="Email"
            name="email"
            label="Email:"
            type="email"
            defaultValue={admin?.adminEmail}
          />

          <div className="mb-4">
            <label className="block my-2 font-semibold text-sm text-gray-700">
              Current Position:
            </label>
            {admin?.role && (
              <p
                className={`p-3 rounded-md text-center font-bold uppercase transition-transform duration-300 ${
                  admin.role === "admin"
                    ? "bg-emerald-200 text-emerald-600 hover:scale-105"
                    : "bg-red-200 text-red-600 hover:scale-105"
                }`}
              >
                {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
              </p>
            )}
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-md shadow-md">
            <label className="block my-2 font-semibold text-sm text-gray-800">
              <span className="text-gray-600">Joined On:</span>{" "}
              {!admin?.createdAt ? (
                <span className="text-red-500">Not set yet</span>
              ) : (
                <span className="text-green-700">
                  {new Date(admin.createdAt).toLocaleString()}
                </span>
              )}
            </label>

            <label className="block my-2 font-semibold text-sm text-gray-800">
              <span className="text-gray-600">Last Updated On:</span>{" "}
              {!admin?.updatedAt ? (
                <span className="text-red-500">Not set yet</span>
              ) : (
                <span className="text-blue-700">
                  {new Date(admin.updatedAt).toLocaleString()}
                </span>
              )}
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors"
          >
            Update Details
          </button>
        </form>
      </div>
    </PageTemplate>
  );
};

export default UpdateDetailsPage;
