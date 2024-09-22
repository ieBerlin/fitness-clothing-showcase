import React, { useRef } from "react";
import TextInput from "./../components/TextInput";
import PageTemplate from "../components/PageTemplate";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "../types/response";
import { updatePassword } from "../utils/authUtils";
import { ModalType } from "../enums/ModalType";
import { openConfirmationModal } from "../features/modal";
import { useDispatch } from "react-redux";
import { passwordValidator } from "../utils/validators";

const ChangePasswordPage: React.FC = () => {
  const dispatch = useDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const {
    mutate,
    isError,
    error: errors,
  } = useMutation<
    null,
    ErrorResponse,
    {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }
  >({
    mutationKey: ["admin-password"],
    mutationFn: async (data) => {
      const { oldPassword, newPassword, confirmPassword } = data;

      // Initialize an empty array to collect validation errors
      const errors: { field: string; message: string }[] = [];

      // Validate old password
      if (!oldPassword || typeof oldPassword !== "string") {
        errors.push({
          field: "oldPassword",
          message: "Old password is required and must be a string.",
        });
      }

      // Validate new password
      if (!newPassword || typeof newPassword !== "string") {
        errors.push({
          field: "newPassword",
          message: "New password is required and must be a string.",
        });
      } else if (!passwordValidator(newPassword)) {
        errors.push({
          field: "newPassword",
          message: "New password does not meet the required criteria.",
        });
      }

      // Validate confirm password
      if (newPassword !== confirmPassword) {
        errors.push({
          field: "confirmPassword",
          message: "New password and confirmation do not match.",
        });
      }

      // If there are validation errors, throw them
      if (errors.length > 0) {
        throw {
          success: false,
          statusCode: 400,
          errors,
        } as ErrorResponse;
      }

     return   await updatePassword(data);
    },
    onSuccess: () => {
      formRef.current?.reset();
      dispatch(
        openConfirmationModal({
          type: ModalType.CONFIRMATION,
          message: "Your password has been updated successfully!",
        })
      );
    },
  });
  const getErrorMessage = (field: string) =>
    errors?.errors.find((error) => error.field === field)?.message || "";
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(fd.entries()) as {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    };
    mutate(data);
  };
  return (
    <PageTemplate title="Change Password">
      <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-8 w-full max-w-md mx-auto mt-3">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            placeholder="Type your current password"
            name="oldPassword"
            label="Current Password:"
            type="password"
            id="currentPassword"
            isError={!!getErrorMessage("oldPassword")}
            errorMessage={getErrorMessage("oldPassword")}
          />
          <TextInput
            placeholder="Type your new password"
            name="newPassword"
            label="New Password:"
            type="password"
            id="newPassword"
            isError={!!getErrorMessage("newPassword")}
            errorMessage={getErrorMessage("newPassword")}
          />

          <TextInput
            placeholder="Confirm your new password"
            name="confirmPassword"
            label="Confirm New Password:"
            type="password"
            id="confirmPassword"
            isError={!!getErrorMessage("confirmPassword")}
            errorMessage={getErrorMessage("confirmPassword")}
          />

          {isError && (
            <div className="text-red-600">
              {/* {submissionError || "An error occurred. Please try again."} */}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors"
          >
            Change Password
          </button>
        </form>
      </div>
    </PageTemplate>
  );
};

export default ChangePasswordPage;
