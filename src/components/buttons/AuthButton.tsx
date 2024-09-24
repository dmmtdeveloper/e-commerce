import clsx from "clsx";
import React from "react";

interface ButtonProps {
  text: string;
}

export const AuthButton: React.FC<ButtonProps> = ({ text }) => {
  return (
    <button
      type="submit"
      className={clsx(
        "bg-blue-500",
        "text-white py-3",
        "rounded-xl",
        "hover:bg-blue-600",
        "transition-all"
      )}
    >
      {text}
    </button>
  );
};
