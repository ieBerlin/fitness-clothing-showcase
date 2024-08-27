import { useSelector, useDispatch } from "react-redux";
import { ActionButton, CancelButton } from "./ActionsButtons";
import { closeModal, openConfirmationModal } from "../features/modal";
import { RootState } from "../store/store";
import {
  ErrorResponse,
  Product,
  SuccessResponse,
  ValidationError,
} from "../types/product.types";
import { useMutation } from "@tanstack/react-query";
import { deleteProduct } from "../utils/authUtils";
import { queryClient } from "../utils/http";
import { isArray } from "lodash";
interface ModalContentProps {
  title?: string;
  bodyContent: React.ReactNode;
  actionsButtons: React.ReactNode[];
}
function EmptyStateModal(): ModalContentProps {
  return {
    title: "No Content Available", // Title of the modal
    bodyContent: (
      <div>
        <p className="text-gray-900 font-light">
          There's nothing to show currently.
        </p>
      </div>
    ),
    actionsButtons: [
      <button
        key="close"
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => closeModal()} // Assuming closeModal is handled elsewhere
      >
        Close
      </button>,
    ],
  };
}
export function ConfirmationModalContent(): ModalContentProps {
  const { message } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  return {
    title: message, // Optional, as you have it in bodyContent too.
    bodyContent: (
      <div>
        <p className="text-gray-900 font-light">{message}</p>
      </div>
    ),
    actionsButtons: [
      <ActionButton
        key="confirmation-ok"
        label="OK"
        onConfirm={() => dispatch(closeModal())}
      />,
    ],
  };
}

export function LogoutModalContent(): ModalContentProps {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(closeModal());
    dispatch(
      openConfirmationModal({ message: "You have successfully logged out." })
    );
  };

  return {
    title: "Are You Sure You Want to Logout?", // Title of the modal
    bodyContent: (
      <div>
        <p className="text-gray-900 font-light">
          Are you sure you want to log out?
        </p>
      </div>
    ),
    actionsButtons: [
      <ActionButton
        key="logout-confirm"
        label="Logout"
        onConfirm={handleLogout}
      />,
      <CancelButton key="logout-cancel" />,
    ],
  };
}
export function ConfirmProductDeletionModal(): ModalContentProps {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.modal);
  const product = data as Product;

  const { isPending, mutate } = useMutation<
    SuccessResponse,
    ErrorResponse,
    string
  >({
    mutationKey: [product?._id],
    mutationFn: deleteProduct,
    onSuccess: () => {
      dispatch(closeModal());
      dispatch(
        openConfirmationModal({
          message: "You have successfully deleted this product.",
        })
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
    return EmptyStateModal();
  }
  const handleDelete = () => {
    mutate(product?._id);
  };

  return {
    title: "Delete Product",
    bodyContent: (
      <div>
        <h2 className="text-lg font-semibold">
          Are You Sure You Want to Delete This Product?
        </h2>
        <p className="text-gray-900 font-light">
          Are you sure you want to delete the product{" "}
          <strong>{product.productName}</strong>?
        </p>
      </div>
    ),
    actionsButtons: [
      <ActionButton
        label="Delete"
        isLoading={isPending}
        onConfirm={handleDelete}
      />,
      <CancelButton isLoading={isPending} />,
    ],
  };
}
export function SuccessModalContent(message: string): ModalContentProps {
  const dispatch = useDispatch();

  return {
    title: "Success!",
    bodyContent: (
      <div>
        <p className="text-gray-900 font-light">{message}</p>
      </div>
    ),
    actionsButtons: [
      <ActionButton
        key="success-ok"
        label="OK"
        onConfirm={() => dispatch(closeModal())}
      />,
    ],
  };
}
export function FieldsError(): ModalContentProps {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.modal);
  if (!data || !data.errors || !isArray(data.errors) || data.length === 0) {
    return EmptyStateModal();
  }
  const errors: ValidationError[] = (data as ErrorResponse)
    .errors as ValidationError[];
  return {
    title: "Validation Errors",
    bodyContent: (
      <div className="error-list">
        <ul>
          {errors.map((error, index) => (
            <li key={index} className="error-item">
              <span className="error-field">{error.field}:</span>{" "}
              {error.message}
            </li>
          ))}
        </ul>
      </div>
    ),
    actionsButtons: [
      <ActionButton
        key="success-ok"
        label="OK"
        onConfirm={() => dispatch(closeModal())}
      />,
    ],
  };
}
