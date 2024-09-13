import React from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputComponent: React.FC<InputProps> = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="true"
        className="border border-slate-300 py-2 px-4 w-full rounded-xl focus:outline-none"
      />
    </div>
  );
};
