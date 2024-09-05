import { useSelector, useDispatch } from "react-redux";
import { ActionButton, CancelButton } from "./ActionsButtons";
import { closeModal, openConfirmationModal } from "../features/modal";
import { RootState } from "../store/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addItemsToSection,
  deleteProduct,
  fetchProducts,
  removeProductFromSection,
} from "../utils/authUtils";
import { queryClient } from "../utils/http";
import { debounce, isArray } from "lodash";
import { ReactNode, useEffect, useRef, useState } from "react";
import ErrorDisplay from "../components/ErrorDisplay";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchInput from "../components/SearchInput";
import Product from "../models/Product";
import {
  ErrorResponse,
  ProductsResponse,
  SectionResponse,
} from "../types/response";
import { ValidationError } from "../types/validation-error.types";
import Section from "../models/Section";
import Availability from "../enums/Availability";
import PriceOptions from "../enums/PriceOptions";
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

export function AddProductToSectionModal(): ModalContentProps {
  const pageRef = useRef<number>(1);
  const searchRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { type, data: modalData } = useSelector(
    (state: RootState) => state.modal
  );

  const data = modalData as { sectionId: string; items: Product[] };
  const [productsState, setProductsState] = useState<{
    products: Product[];
    args: string;
  }>({
    products: [],
    args: "",
  });
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const {
    mutate,
    error: mutationError,
    isError: hasMutationError,
    isPending: isMutating,
  } = useMutation<
    SectionResponse,
    ErrorResponse,
    { sectionId: string; items: Product[] }
  >({
    mutationKey: ["sections-products"],
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

  const {
    isFetching,
    isError: hasQueryErrors,
    error: queryError,
    data: fetchedProducts,
  } = useQuery<ProductsResponse, ErrorResponse>({
    queryKey: ["products-sections"],
    queryFn: () =>
      fetchProducts({
        price: PriceOptions.ALL,
        availability: Object.values(Availability) as Availability[],
        page: pageRef.current ?? 1,
        search: searchRef.current?.value,
      }),
    enabled: type === "add-product-to-section",
  });
  useEffect(() => {
    if (fetchedProducts && fetchedProducts.products) {
      setProductsState((prevState) => {
        const currentArgs = searchRef.current?.value ?? "";
        const prevArgs = prevState.args;

        const prevProducts = prevState.products;
        const newProducts = (fetchedProducts.products as Product[]).filter(
          (product) => !prevProducts.some((pro) => pro._id === product._id)
        );

        const updatedProducts =
          prevArgs === currentArgs
            ? [...prevProducts, ...newProducts]
            : newProducts;

        updatedProducts.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );
        pageRef.current = prevArgs === currentArgs ? pageRef.current : 1;
        return {
          products: updatedProducts,
          args: currentArgs,
        };
      });
    }
  }, [fetchedProducts]);
  useEffect(() => {
    if (data && data.items && !isFetching) {
      setSelectedProducts(data.items);
    }
  }, [data, isFetching]);
  // Consolidate errors into a single array
  const errors: ErrorResponse[] = [];
  if (hasQueryErrors && queryError) {
    errors.push(queryError);
  }
  if (hasMutationError && mutationError) {
    errors.push(mutationError);
  }

  // Handle product selection toggle
  const handleItemAddOrRemove = (item: Product) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.find((product) => product._id === item._id)
        ? prevProducts.filter((product) => product._id !== item._id)
        : [...prevProducts, item]
    );
  };

  const handleInputChange = debounce(() => {
    queryClient.invalidateQueries({
      queryKey: ["products-sections"],
    });
  }, 300);

  let content: ReactNode;
  if (!data || !data.sectionId) {
    content = EmptyStateModal().bodyContent;
  } else if (isFetching) {
    content = (
      <div className="flex items-center justify-center w-full py-10 flex-col gap-4">
        <LoadingSpinner fill="blue-600" text="gray-400" dimension="16" />
        <h2 className="text-gray-500 font-semibold">Loading products...</h2>
      </div>
    );
  } else if (errors.length > 0) {
    content = (
      <div className="space-y-4">
        {errors.map((error) => (
          <ErrorDisplay key={error.statusCode} error={error} />
        ))}
      </div>
    );
  } else if (fetchedProducts?.products && fetchedProducts.products.length > 0) {
    function handleShowMoreItems() {
      const totalPages = fetchedProducts?.totalPages;
      const currentPage = fetchedProducts?.currentPage;
      if (totalPages && currentPage && totalPages > currentPage) {
        pageRef.current++;
        setProductsState((prevState) => ({
          ...prevState,
        }));
        queryClient.invalidateQueries({
          queryKey: ["products-sections"],
        });
      }
    }
    const isShowMoreVisible = fetchedProducts?.totalProducts
      ? fetchedProducts.totalProducts > productsState.products.length
      : 0;
    content = (
      <div>
        <div className="flex justify-between flex-row w-full mb-3">
          <h3 className="text-lg font-semibold">Available Products:</h3>
          <div className="px-2 py-1 bg-gray-300 rounded-md w-fit">
            <h3 className="text-gray-800 font-semibold">
              {" "}
              All {productsState.products.length ?? 0}
            </h3>
          </div>
        </div>
        <ul className="space-y-2">
          {productsState.products.map((product) => (
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
        {!isFetching &&
          (isShowMoreVisible ? (
            <div className="mt-4 text-center">
              <button
                onClick={handleShowMoreItems}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors"
              >
                Show More
              </button>
            </div>
          ) : (
            <div className="mt-4 text-center">
              <h2 className="text-gray-600 font-semibold text-sm">
                End Of Results
              </h2>
            </div>
          ))}
      </div>
    );
  } else {
    content = (
      <div className="text-gray-700">
        {searchRef?.current?.value
          ? `No products found for "${searchRef.current.value}".`
          : "No products available."}
      </div>
    );
  }
  return {
    title: "Add Product to Section",
    bodyContent: (
      <div className="p-4">
        <div className="mb-4">
          <SearchInput onChange={handleInputChange} ref={searchRef} />
        </div>
        {content}
      </div>
    ),
    actionsButtons: [
      <ActionButton
        key="confirm"
        label={isMutating ? "Adding..." : "Add Product"}
        onConfirm={() => {
          mutate({
            sectionId: data.sectionId,
            items: selectedProducts,
          });
        }}
        // disabled={selectedProducts.length === 0 || isMutating}
      />,
      <ActionButton
        key="cancel"
        label="Cancel"
        onConfirm={() => dispatch(closeModal())}
      />,
    ],
  };
}
