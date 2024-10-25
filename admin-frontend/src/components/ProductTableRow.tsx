import { FC, ReactNode } from "react";
import Product from "../models/Product";
import { Link } from "react-router-dom";
import StyledAvailability from "./StyledAvailability";
import { imageUrl, NoImageAvailable } from "../utils/http";

const ProductTableRow: FC<{
  product: Product;
  count: number;
  actionsButtons: ReactNode;
}> = ({ product, count: index, actionsButtons }) => {
  return (
    <tr className="hover:bg-gray-100 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 border-b border-gray-200">
        {index}
      </td>
      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
        <Link to={`/products/${product._id}`} className="block text-gray-600">
          <img
            loading="lazy"
            className="w-8 h-8 object-cover transition-opacity duration-300"
            src={
              product.images[0]?.pathname
                ? `${imageUrl}${product.images[0].pathname}`
                : NoImageAvailable
            }
            alt={`Image of ${product.productName}`}
          />
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
        <Link to={`/products/${product._id}`} className="block text-gray-800">
          <div className="text-sm font-medium">{product.productName}</div>
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
        <Link to={`/products/${product._id}`} className="block text-gray-800">
          <div className="text-sm font-medium">DZD {product.price}</div>
        </Link>
      </td>

      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
        <Link to={`/products/${product._id}`} className="block text-gray-600">
          <div className="text-sm font-medium">
            <StyledAvailability status={product.availability} />
          </div>
        </Link>
      </td>

      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
        {actionsButtons}
      </td>
    </tr>
  );
};
export default ProductTableRow;
