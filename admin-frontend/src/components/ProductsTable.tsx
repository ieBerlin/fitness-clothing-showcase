import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import StyledAvailability from "../components/StyledAvailability";
import DropdownMenu from "../components/DropdownMenu";
import { productsQuantity } from "../utils/func";
import { ReactNode } from "react";
import Product from "../models/Product";
import Availability from "../enums/Availability";
interface ProductTableProps {
  products: Product[];
  actionsDropDownMenuContent: (product: Product) => ReactNode;
}
export default function ProductTable({
  products,
  actionsDropDownMenuContent,
}: ProductTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-md">
      <thead className="bg-gray-50">
        <tr>
          {["Product Name", "Price", "Availability", "Quantity", "Actions"].map(
            (header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {header}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {products.length > 0 ? (
          products.map((product) => {
            const { _id, productName, price, availability } = product;
            return (
              <tr key={_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  ${price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  <StyledAvailability status={availability as Availability} />
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
        ) : (
          <tr>
            <td
              colSpan={5}
              className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-600"
            >
              No products available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
