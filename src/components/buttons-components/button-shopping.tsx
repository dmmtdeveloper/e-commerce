import React from "react";
import { MdOutlineShoppingCart } from "react-icons/md";


interface ButtonSettingProps {
  onClick?: () => void;
  onSubmit?: () => void;
  text: string;
  className?: string;
  type?: "button" | "submit" | "reset"; // Opciones para el tipo de botón, por defecto será "submit"
  isSubmitting?: boolean;
}

const ButtonShoppingComponent: React.FC<ButtonSettingProps> = ({
  isSubmitting,
  onClick,
  onSubmit,
  text,
  className,
  type
}) => {
  return (
    <button
    disabled={isSubmitting}
    type={type}
    onSubmit={onSubmit}
    onClick={onClick}
    className={`flex items-center justify-center gap-4 bg-blue-500 hover:bg-blue-600 font-semibold transition-all text-slate-50 py-2 mt-4 w-full rounded-xl group ${className}`}
>
    {text}
    <MdOutlineShoppingCart className="text-2xl transition-transform group-hover:translate-x-4" />
</button>

  );
};

export default ButtonShoppingComponent;
