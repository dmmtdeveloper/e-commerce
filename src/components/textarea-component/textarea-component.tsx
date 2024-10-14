import React from "react";
import { TextareaProps } from "@/types/types";
import ErrorMessage from "../error-message-component/error-message";

const TextareaComponent: React.FC<TextareaProps> = ({
  placeholder = "",
  value,
  onChange,
  name,
  register,
  error
}) => {
  return (
    <div className="relative w-full">
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...register} // Aquí aplicas el `register` al input
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

export default TextareaComponent;
