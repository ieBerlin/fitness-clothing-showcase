import { FC, InputHTMLAttributes } from "react";

interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    readonly?: boolean;
    label?: string;
    min?: number;
    max?: number;
    name: string;
}

const NumberInput: FC<NumberInputProps> = ({
    placeholder,
    readonly,
    label,
    min,
    max,
    name,
    ...props
}) => {
    return (
        <div>
            {label && (
                <label className="block mb-2 font-semibold text-sm text-gray-700">
                    {label}
                </label>
            )}
            <input
                type="number"
                className="py-2 px-4 block w-full border-gray-200 border-2 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                placeholder={placeholder}
                readOnly={readonly}
                min={min}
                max={max}
                name={name}
                {...props}
            />
        </div>
    );
};

export default NumberInput;
