import { InputProps } from "@/types/types";
import React from "react";
import ErrorMessage from "../error-message-component/error-message";

export const InputComponent: React.FC<InputProps> = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  onClick,
  name,
  id,
  register,
  accept,
  error
}) => {
  // Prevent 'e' or 'E' input for type="number"
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number" && e.key.toLowerCase() === "e") {
      e.preventDefault();
    }
  };
  return (
    <div className="relative w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={onClick}
        autoComplete="true"
        name={name}
        id={id}
        {...register} // Aquí aplicas el `register` al input
        accept={accept}
        onKeyDown={handleKeyDown} // Prevent 'e' or 'E' only for number type
        className={`${
          error
            ? "border border-slate-300 font-light py-2 px-4 w-full rounded-xl focus:outline-red-500"
            : "border border-slate-300 font-light py-2 px-4 w-full rounded-xl focus:outline-blue-400"
          }`}
      />
        {error && <ErrorMessage message={error} />}
    </div>
  );
};
