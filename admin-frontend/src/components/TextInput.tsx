import { FC, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  placeholder: string;
  label?: string;
  name: string;
  type?: string;
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
          required
          rows={3}
          className="py-3 px-4 block border-gray-200 border-2 w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
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
          required
          type={type}
          className="py-3 px-4 block border-gray-200 border-2 w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
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
    </div>
  );
};

export default TextInput;
