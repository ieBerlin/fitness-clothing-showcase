import { FC, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  placeholder: string;
  label?: string;
  name: string;
  type?: string;
  isError?: boolean;
  errorMessage?: string;
}

// Extend the props for both input and textarea elements
type InputProps = BaseProps &
  (
    | InputHTMLAttributes<HTMLInputElement>
    | TextareaHTMLAttributes<HTMLTextAreaElement>
  );

const TextInput: FC<InputProps> = ({
  type = "text",
  placeholder,
  label,
  name,
  isError = false,
  errorMessage = "",
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className="block my-2 font-semibold text-sm text-gray-700">
          {label}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          rows={3}
          className={`py-3 px-4 block border-2 w-full rounded-lg text-sm focus:outline-none ${
            isError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          }`}
          name={name}
          style={
            props.readOnly
              ? {
                  borderColor: "#e5e7eb",
                }
              : undefined
          }
          placeholder={placeholder}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          type={type}
          className={`py-3 px-4 block border-2 w-full rounded-lg text-sm focus:outline-none ${
            isError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          }`}
          name={name}
          style={
            props.readOnly
              ? {
                  borderColor: "#e5e7eb",
                }
              : undefined
          }
          placeholder={placeholder}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {isError && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default TextInput;
