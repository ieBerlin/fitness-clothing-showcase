import { useSelector, useDispatch } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { closeModal } from "../features/modal";
import React, { ReactNode } from "react";
import {
  AddProductToSectionModal,
  ConfirmationModalContent,
  ConfirmProductDeletionModal,
  ConfirmRemoveProductFromSection,
  EditAdminModalContent,
  FieldsError,
  LogoutModalContent,
  SuccessModalContent,
} from "./modal-contents";
import { ModalType } from "../enums/ModalType";
interface IModalContent {
  title: string;
  bodyContent: ReactNode;
  actionsButtons: ReactNode[];
}
function Modal() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isOpen, type } = useSelector((state: any) => state.modal);
  const dispatch = useDispatch();
  const MODAL_CONTENTS = {
    [ModalType.LOGOUT]: LogoutModalContent(),
    [ModalType.FIELDSERROR]: FieldsError(),
    [ModalType.CONFIRMATION]: ConfirmationModalContent(),
    [ModalType.DELETE_PRODUCT]: ConfirmProductDeletionModal(),
    [ModalType.ADD_PRODUCT_TO_SECTION]: AddProductToSectionModal(),
    [ModalType.EDIT_ADMIN]: EditAdminModalContent(),
    [ModalType.REMOVE_PRODUCT_TO_SECTION]: ConfirmRemoveProductFromSection(),
    [ModalType.PRODUCT_ADDED_SUCCESS]: SuccessModalContent(
      "This product has been added successfully."
    ),
    [ModalType.PRODUCT_DELETED_SUCCESS]: SuccessModalContent(
      "This product has been deleted successfully."
    ),
    [ModalType.PRODUCT_UPDATED_SUCCESS]: SuccessModalContent(
      "This product has been updated successfully."
    ),
  };
  if (!isOpen) {
    return null;
  }

  const modalContent = MODAL_CONTENTS[type as ModalType];
  if (!modalContent) {
    return null;
  }
  const { title, bodyContent, actionsButtons } = modalContent as IModalContent;

  return (
    <dialog
      open={isOpen}
      className="fixed inset-0 z-[9999] flex justify-center items-center w-full h-full bg-black bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-2xl bg-gray-100 shadow max-h-[90%] overflow-auto">
        <div className="flex items-center justify-between p-2 border-b">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={() => dispatch(closeModal())}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 text-sm w-8 h-8 inline-flex justify-center items-center"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">{bodyContent}</div>
        <div className="flex items-center p-4 border-t border-gray-200 gap-3">
          {actionsButtons.map((button, index) => (
            <React.Fragment key={index}>{button}</React.Fragment>
          ))}
        </div>
      </div>
    </dialog>
  );
}

export default Modal;
