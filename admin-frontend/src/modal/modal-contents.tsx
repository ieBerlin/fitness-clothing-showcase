import { useSelector, useDispatch } from "react-redux";
import { ActionButton, CancelButton } from "./ActionsButtons";
import { closeModal, openConfirmationModal } from "../features/modal";
import { RootState } from "../store/store";
import { useMutation } from "@tanstack/react-query";
import {
  addItemsToSection,
  deleteProduct,
  fetchProducts,
  removeProductFromSection,
} from "../utils/authUtils";
import { ExtendedFilterParams, queryClient } from "../utils/http";
import { isArray } from "lodash";
import { useCallback, useEffect, useState } from "react";
import Product from "../models/Product";
import { ErrorResponse, SectionResponse } from "../types/response";
import { ValidationError } from "../types/validation-error.types";
import Section from "../models/Section";
import DataTable from "../components/DataTable";
import DropdownFilterGroup from "../components/FilterDropdownMenus";
import SearchBar from "../components/SearchBar";
import Availability from "../enums/Availability";
import PriceOptions from "../enums/PriceOptions";
import { productQueryKey } from "../constants/queryKeys";
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
export function ConfirmRemoveProductFromSection(): ModalContentProps {
  const { data } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();
  const product = data?.product as Product;
  const section = data?.section as Section;
  const { mutate: removeProduct, isPending: isRemoving } = useMutation<
    SectionResponse,
    ErrorResponse,
    { sectionId: string; productId: string }
  >({
    mutationKey: ["sections", `section-${section?.name}`],
    mutationFn: removeProductFromSection,
    onSuccess: () => {
      dispatch(closeModal());
      dispatch(
        openConfirmationModal({
          message: "You have successfully removed this item.",
        })
      );
      queryClient.invalidateQueries({
        queryKey: ["sections"],
      });
    },
  });

  if (
    !data ||
    (typeof data === "object" && Object.keys(data).length === 0) ||
    !data.section ||
    !data.product
  ) {
    return EmptyStateModal();
  }

  const handleRemoveProduct = () => {
    removeProduct({ sectionId: section?._id, productId: product._id });
  };

  return {
    title: "Remove Product",
    bodyContent: (
      <div>
        <h2 className="text-lg font-semibold">
          Are you sure you want to remove {product.productName}?
        </h2>
        <p className="text-gray-900 font-light">
          Removing <strong>{product.productName}</strong> from the section
          cannot be undone.
        </p>
      </div>
    ),
    actionsButtons: [
      <ActionButton
        label="Remove"
        isLoading={isRemoving}
        onConfirm={handleRemoveProduct}
      />,
      <CancelButton isLoading={isRemoving} />,
    ],
  };
}

export function ConfirmProductDeletionModal(): ModalContentProps {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.modal);
  const product = data as Product;

  const { isPending, mutate } = useMutation<null, ErrorResponse, string>({
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

type ProductFilterParams = {
  availability: Availability[];
  price: PriceOptions;
};
const defaultFilterParams: ExtendedFilterParams<ProductFilterParams> = {
  currentPage: 1,
  searchTerm: "",
  itemLimit: 10,
  availability: Object.values(Availability) as Availability[],
  price: PriceOptions.ALL,
};

export function AddProductToSectionModal(): ModalContentProps {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const dispatch = useDispatch();
  const { data: modalData } = useSelector((state: RootState) => state.modal);
  const data = modalData as { sectionId: string; items: Product[] };
  const { mutate, isPending: isMutating } = useMutation<
    SectionResponse,
    ErrorResponse,
    { sectionId: string; items: Product[] }
  >({
    mutationKey: ["sections"],
    mutationFn: addItemsToSection,
    onSuccess: () => {
      dispatch(closeModal());
      queryClient.invalidateQueries({
        queryKey: ["sections"],
      }); // Ensure the data is updated
    },
    onError: (error) => {
      console.error("Failed to add products to section:", error);
    },
  });
  useEffect(() => {
    if (data && data.items) {
      setSelectedProducts(data.items);
    }
  }, [data]);
  const [params, setParams] =
    useState<ExtendedFilterParams<ProductFilterParams>>(defaultFilterParams);
  const handleItemAddOrRemove = (item: Product) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.find((product) => product._id === item._id)
        ? prevProducts.filter((product) => product._id !== item._id)
        : [...prevProducts, item]
    );
  };
  const handleUpdateArgs = useCallback(
    (params: ExtendedFilterParams<ProductFilterParams>) => {
      setParams(params);
    },
    []
  );

  return {
    title: "Add Product to Section",
    bodyContent: (
      <DataTable<Product, ProductFilterParams>
        fetchItems={fetchProducts}
        fetchDataParams={params}
        initialParams={params}
        updateParams={handleUpdateArgs}
        renderTableContent={({ dataEntries, updateFilterParams }) => ({
          ContentRenderer: () => (
            <div>
              <div className="flex justify-between flex-row w-full mb-3">
                <h3 className="text-lg font-semibold">Available Products:</h3>
                <div className="px-2 py-1 bg-gray-300 rounded-md w-fit">
                  <h3 className="text-gray-800 font-semibold">
                    {" "}
                    All {dataEntries.length ?? 0}
                  </h3>
                </div>
              </div>
              <ul className="space-y-2">
                {dataEntries.map((product) => (
                  <li
                    key={product._id}
                    className={`p-3 border border-gray-300 rounded cursor-pointer ${
                      selectedProducts.find((p) => p._id === product._id)
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-blue-50"
                    } transition-all`}
                    onClick={() => handleItemAddOrRemove(product)}
                  >
                    {product.productName}
                  </li>
                ))}
              </ul>
            </div>
          ),
          dropDownMenus: (
            <DropdownFilterGroup
              searchDropDownMenu={
                <SearchBar
                  onChange={(e) =>
                    updateFilterParams("searchTerm", e.target.value)
                  }
                />
              }
            />
          ),
        })}
        queryKey={productQueryKey}
      />
    ),
    actionsButtons: [
      <ActionButton
        isLoading={isMutating}
        key="confirm"
        label={isMutating ? "Adding..." : "Add Product"}
        onConfirm={() => {
          mutate({
            sectionId: data.sectionId,
            items: selectedProducts,
          });
        }}
        disabled={selectedProducts.length === 0 || isMutating}
      />,
      <ActionButton
        key="cancel"
        label="Cancel"
        onConfirm={() => dispatch(closeModal())}
      />,
    ],
  };
}
