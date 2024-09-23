import { InputProps } from "@/types/types";
import React from "react";

export const InputComponent: React.FC<InputProps> = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="true"
        className="border border-slate-300 py-2 px-4 w-full rounded-xl focus:outline-blue-400"
        name={name}
      />
    </div>
  );
};
