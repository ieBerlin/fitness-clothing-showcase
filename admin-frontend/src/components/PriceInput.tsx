import React, { InputHTMLAttributes } from "react";
interface PriceInputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
}

const PriceInput: React.FC<PriceInputProps> = (props) => {
    return (
        <div className="flex flex-col w-full">
            <label className="block my-2 font-semibold text-sm text-gray-700">
                Price
            </label>
            <div className="relative flex w-full">
                <input
                    type="text"
                    id="price-input"
                    className="py-3 px-4 block border-gray-200 border-2 w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter price"
                    {...props}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-4 text-gray-500 z-20">
                    DZD
                </div>
            </div>
        </div>
    );
};

export default PriceInput;
