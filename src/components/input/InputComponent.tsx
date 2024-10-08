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
  error
}) => {
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
        {...register}
        className={`${
          error
            ? "border border-slate-300 font-light py-2 px-4 w-full rounded-xl focus:outline-red-500"
            : "border border-slate-300 font-light py-2 px-4 w-full rounded-xl focus:outline-blue-400"
        }`}
        />
        {error && <ErrorMessage message={error.message} />}
    </div>
  );
};
