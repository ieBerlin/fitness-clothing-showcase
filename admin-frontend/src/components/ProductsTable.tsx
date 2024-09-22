import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import StyledAvailability from "../components/StyledAvailability";
import DropdownMenu from "../components/DropdownMenu";
import { productsQuantity } from "../utils/func";
import { ReactNode } from "react";
import Product from "../models/Product";
interface ProductTableProps {
  products: Product[];
  actionsDropDownMenuContent: (product: Product) => ReactNode;
  isLoading: boolean;
}
export default function ProductTable({
  isLoading,
  products,
  actionsDropDownMenuContent,
}: ProductTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200 bg-white">
      <thead className="bg-gray-50">
        <tr>
          {[
            "count",
            "Product Name",
            "Price",
            "Availability",
            "Quantity",
            "Actions",
          ].map((header, index) => (
            <th
              key={index}
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {isLoading ? (
          <tr>
            <td
              colSpan={5}
              className="px-6 py-4 text-center text-sm font-medium text-gray-600"
            >
              <div className="flex justify-center items-center space-x-2">
                <svg
                  className="w-5 h-5 text-gray-400 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Loading products...</span>
              </div>
            </td>
          </tr>
        ) : (
          products.map((product, index) => {
            const { _id, productName, price, availability } = product;
            return (
              <tr key={_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  ${price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  <StyledAvailability status={availability} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {productsQuantity(product)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  <DropdownMenu
                    position="top-1 right-1"
                    label={
                      <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors" />
                    }
                    content={actionsDropDownMenuContent(product)}
                  />
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
