import { useSelector, useDispatch } from "react-redux";
import { ActionButton, CancelButton } from "./ActionsButtons";
import { closeModal, openConfirmationModal } from "../features/modal";
import { RootState } from "../store/store";
import { Product } from "../types/product.types";
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
  if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
    return EmptyStateModal();
  }
  const product = data as Product;
  const handleDelete = () => {
    dispatch(closeModal());
    dispatch(
      openConfirmationModal({
        message: "You have successfully deleted this product.",
      })
    );
  };

  return {
    title: "Are You Sure You Want to Delete This Product?",
    bodyContent: (
      <div>
        <p className="text-gray-900 font-light">
          Are you sure you want to delete the product {product.productName}
        </p>
      </div>
    ),
    actionsButtons: [
      <ActionButton
        key="delete-confirm"
        label="Delete"
        onConfirm={handleDelete}
      />,
      <CancelButton key="delete-cancel" />,
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
