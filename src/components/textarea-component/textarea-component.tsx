import React from "react";
import { TextareaProps } from "@/types/types";

const TextareaComponent: React.FC<TextareaProps> = ({
  placeholder = "",
  value,
  onChange,
  name,
}) => {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="border border-slate-300 font-light py-2 px-4 w-full rounded-xl focus:outline-blue-400 resize-none"
    />
  );
};

export default TextareaComponent;
