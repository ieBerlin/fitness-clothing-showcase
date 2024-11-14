import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import NoImageAvailable from "/NoImageAvailable.jpg";
import Image from "../models/Image";

export interface ModalState {
  isOpen: boolean;
  currentImage: Image;
  currentImageIndex: number;
  totalImagesCount: number;
  imageSources: Image[];
}

const initialState: ModalState = {
  isOpen: false,
  currentImage: { _id: "", pathname: NoImageAvailable },
  currentImageIndex: -1,
  totalImagesCount: 0,
  imageSources: [],
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    updateModalData: (
      state,
      action: PayloadAction<{
        currentImageIndex?: number;
        totalImagesCount: number;
        imageSources: Image[];
      }>
    ) => {
      const { currentImageIndex, totalImagesCount, imageSources } =
        action.payload;

      state.currentImageIndex = currentImageIndex ?? -1;
      state.currentImage =
        state.currentImageIndex === -1
          ? { _id: "", pathname: NoImageAvailable }
          : imageSources[state.currentImageIndex] || {
              _id: "",
              pathname: NoImageAvailable,
            };
      state.totalImagesCount = totalImagesCount;
      state.imageSources = imageSources;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    updateImageIndex: (state, action: PayloadAction<number>) => {
      state.currentImageIndex = action.payload;
      state.currentImage =
        action.payload === -1
          ? { _id: "", pathname: NoImageAvailable }
          : state.imageSources[action.payload] || {
              _id: "",
              pathname: NoImageAvailable,
            };
    },
  },
});
export const { updateModalData, openModal, closeModal, updateImageIndex } =
  modalSlice.actions;

export const selectModalState = (state: { modal: ModalState }) => state.modal;

export default modalSlice.reducer;
