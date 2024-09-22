/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalType } from "../enums/ModalType";

export interface ModalState {
  isOpen: boolean;
  type?: ModalType;
  message?: string;
  data?: any;
}

const initialState: ModalState = {
  isOpen: false,
  type: undefined,
  message: undefined,
  data: undefined,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
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

    openConfirmationModal: (
      state,
      action: PayloadAction<{
        message?: string;
        data?: any;
      }>
    ) => {
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
