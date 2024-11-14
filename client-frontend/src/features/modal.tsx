import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import NoImageAvailable from "/NoImageAvailable.jpg";

export interface ModalState {
  isOpen: boolean;
  currentImageSrc: string;
  currentImageIndex: number;
  totalImagesCount: number;
}

const initialState: ModalState = {
  isOpen: false,
  currentImageSrc: NoImageAvailable,
  currentImageIndex: 0,
  totalImagesCount: 0,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        currentImageSrc: string;
        currentImageIndex?: number;
        totalImagesCount: number;
      }>
    ) => {
      const { currentImageSrc, currentImageIndex, totalImagesCount } =
        action.payload;
      state.isOpen = true;
      state.currentImageSrc = currentImageSrc;
      if (currentImageIndex) {
        state.currentImageIndex = currentImageIndex;
      }
      state.totalImagesCount = totalImagesCount;
      console.log(currentImageSrc)
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.currentImageSrc = NoImageAvailable;
      state.currentImageIndex = 0;
      state.totalImagesCount = 0;
    },
    updateImageIndex: (state, action: PayloadAction<number>) => {
      state.currentImageIndex = action.payload;
    },
  },
});
export const { openModal, closeModal, updateImageIndex } = modalSlice.actions;
export default modalSlice.reducer;
