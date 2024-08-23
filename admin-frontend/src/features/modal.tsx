import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalType } from "../types/modal.types";

// Define the shape of the modal state
export interface ModalState {
  isOpen: boolean;
  type?: ModalType;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

// Define the initial state of the modal slice
const initialState: ModalState = {
  isOpen: false,
  type: undefined,
  data: undefined,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      const { type, data } = action.payload;
      state.isOpen = true;
      state.type = type as ModalType;
      state.data = data;
    },

    closeModal: (state) => {
      state.isOpen = false;
      state.type = undefined;
      state.data = undefined;
    },

    openConfirmationModal: (state, action) => {
      state.isOpen = true;
      state.type = ModalType.CONFIRMATION;
      state.message = action.payload.message;
      state.data = undefined;
    },

    clearModalData: (state) => {
      state.data = undefined;
    },
  },
});
export const { openModal, closeModal, openConfirmationModal, clearModalData } =
  modalSlice.actions;
export default modalSlice.reducer;
