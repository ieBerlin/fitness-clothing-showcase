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
  updateProfile,
} from "../utils/authUtils";
import {
  ExtendedFilterParams,
  imageUrl,
  NoImageAvailable,
  queryClient,
} from "../utils/http";
import { isArray } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import Product from "../models/Product";
import { ErrorResponse, SectionResponse } from "../types/response";
import { ValidationError } from "../types/validation-error.types";
import Section from "../models/Section";
import DataTable from "../components/DataTable";
import DropdownFilterGroup from "../components/FilterDropdownMenus";
import SearchBar from "../components/SearchBar";
import Availability from "../enums/Availability";
import PriceOptions from "../enums/PriceOptions";
import Admin from "../models/Admin";
import TextInput from "../components/TextInput";
import SelectInput from "../components/SelectInput";
import ErrorAlert from "../components/ErrorAlert";
import { getQueryKey } from "../constants/queryKeys";
interface ModalContentProps {
  title?: string;
  bodyContent: React.ReactNode;
  actionsButtons: React.ReactNode[];
}
function EmptyStateModal(): ModalContentProps {
  return {
    title: "No Content Available",
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
        className="px-4 py-2 bg-blue-500 text-white"
        onClick={() => closeModal()}
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
    title: message,
    bodyContent: (
      <p className="text-gray-800 font-medium text-center leading-relaxed">
        {message}
      </p>
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
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    queryClient.cancelQueries();
    queryClient.clear();
    dispatch(closeModal());

    window.location.href = "/";
  };

  return {
    title: "Are You Sure You Want to Logout?",
    bodyContent: (
      <p className="text-gray-800 font-medium text-center leading-relaxed">
        Are you sure you want to log out?
      </p>
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
    mutationKey: getQueryKey("sections"),
    mutationFn: removeProductFromSection,
    onSuccess: () => {
      dispatch(closeModal());
      dispatch(
        openConfirmationModal({
          message: "You have successfully removed this item.",
        })
      );
      queryClient.invalidateQueries({
        queryKey: getQueryKey("sections"),
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
      <div className="text-gray-800">
        <h2 className="text-xl font-semibold mb-2">
          Are you sure you want to remove{" "}
          <span className="text-red-600">{product.productName}</span> ?
        </h2>
        <p className="text-gray-700 font-light">
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
    mutationKey: getQueryKey("sections"),
    mutationFn: addItemsToSection,
    onSuccess: () => {
      dispatch(closeModal());
      queryClient.invalidateQueries({
        queryKey: getQueryKey("sections"),
      });
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
        renderTableContent={({
          dataEntries,
          updateFilterParams,
          allItems,
        }) => ({
          ContentRenderer: () => (
            <div>
              <div className="flex justify-between flex-row w-full mb-3">
                <h3 className="text-lg font-semibold">Available Products:</h3>
                <div className="px-2 py-1 bg-gray-300 w-fit">
                  <h3 className="text-gray-800 font-semibold">
                    All {allItems ?? 0}
                  </h3>
                </div>
              </div>
              <ul className="space-y-2">
                {dataEntries.map((product) => (
                  <li
                    key={product._id}
                    className={`p-3 border border-gray-200 rounded-lg shadow-sm cursor-pointer transition-transform transform ${
                      selectedProducts.find((p) => p._id === product._id)
                        ? "bg-blue-50 border-blue-300 scale-105"
                        : "hover:bg-blue-50 hover:scale-105"
                    } flex items-center gap-4`}
                    onClick={() => handleItemAddOrRemove(product)}
                  >
                    <div className="flex items-center gap-3 flex-grow">
                      <img
                        loading="lazy"
                        className="w-10 h-10 object-cover rounded-md transition-opacity duration-300"
                        src={
                          product.images[0]?.pathname
                            ? `${imageUrl}${product.images[0].pathname}`
                            : NoImageAvailable
                        }
                        alt={`Image of ${product.productName}`}
                      />
                      <span className="text-gray-900 font-semibold text-base">
                        {product.productName}
                      </span>
                    </div>

                    <span className="ml-auto text-blue-600 font-semibold text-base">
                      ${product.price}
                    </span>
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
        queryKey={getQueryKey("sections")}
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
      <CancelButton />,
    ],
  };
}

export function EditAdminModalContent(): ModalContentProps {
  const dispatch = useDispatch();
  const { data: modalData } = useSelector((state: RootState) => state.modal);
  const adminData = modalData as Admin;

  const {
    mutate,
    isPending: isMutating,
    isError,
    error,
  } = useMutation<
    null,
    ErrorResponse,
    {
      adminId: string;
      fullName: string;
      role: string;
      status: string;
    }
  >({
    mutationKey: getQueryKey("admins"),
    mutationFn: updateProfile,
    onSuccess: () => {
      dispatch(closeModal());
      dispatch(
        openConfirmationModal({
          message: "You have successfully updated this admin.",
        })
      );
      queryClient.invalidateQueries({
        queryKey: getQueryKey("admins"),
      });
    },
  });
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmission = () => {
    const fd = new FormData(formRef.current!);
    const formData = {
      fullName: fd.get("full-name") as string,
      role: fd.get("role") as string,
      status: fd.get("status") as string,
      adminId: adminData._id,
    };
    mutate(formData);
  };

  return {
    title: "Edit Admin Details",
    bodyContent: (
      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className="space-y-4 text-gray-700"
      >
        <TextInput
          placeholder="Full Name"
          name="full-name"
          label="Full Name:"
          type="text"
          defaultValue={adminData?.fullName}
        />
        <TextInput
          disabled
          readOnly
          placeholder="Email"
          name="email"
          label="Email:"
          type="email"
          defaultValue={adminData?.adminEmail}
        />
        <SelectInput
          selectedField="admin"
          // selectedField={adminData?.role}
          name="role"
          label={"Current Position"}
          data={[
            {
              value: "manager",
              label: "Manager",
            },
            {
              value: "admin",
              label: "Admin",
            },
          ]}
        />

        <div className="mb-4 p-4 bg-gray-50 rounded-md shadow-md">
          <label className="block my-2 font-semibold text-sm text-gray-800">
            <span className="text-gray-600">Joined On:</span>{" "}
            {!adminData?.createdAt ? (
              <span className="text-red-500">Not set yet</span>
            ) : (
              <span className="text-green-700">
                {new Date(adminData.createdAt).toLocaleString()}
              </span>
            )}
          </label>

          <label className="block my-2 font-semibold text-sm text-gray-800">
            <span className="text-gray-600">Last Updated On:</span>{" "}
            {!adminData?.updatedAt ? (
              <span className="text-red-500">Not set yet</span>
            ) : (
              <span className="text-blue-700">
                {new Date(adminData.updatedAt).toLocaleString()}
              </span>
            )}
          </label>
        </div>
        {isError && <ErrorAlert isTheTitleShown={false} error={error} />}
      </form>
    ),
    actionsButtons: [
      <ActionButton
        isLoading={isMutating}
        key="edit-admin-save"
        label={isMutating ? "Updating..." : "Update Details"}
        onConfirm={handleSubmission}
        disabled={!adminData?._id || isMutating}
      />,
      <CancelButton key="edit-admin-cancel" />,
    ],
  };
}
