import { InputProps } from "@/types/types";
import React from "react";

export const InputComponent: React.FC<InputProps> = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  onClick,
  name,
  id,
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
        className="border border-slate-300 font-light py-2 px-4 w-full rounded-xl focus:outline-blue-400"
        name={name}
        id={id}
      />
    </div>
  );
};