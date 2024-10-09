import React from "react";
import { SiMicrosoftexcel } from "react-icons/si";

interface ButtonSettingProps {
  onClick?: () => void;
  onSubmit?: () => void;
  text: string;
  className?: string;
  type?: "button" | "submit" | "reset"; // Opciones para el tipo de botón, por defecto será "submit"
  isSubmitting?: boolean;
}

const ExcelButtonComponent: React.FC<ButtonSettingProps> = ({
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
    className={`bg-green-500 flex items-center gap-2 group hover:bg-green-600 transition-all duration-300 text-gray-100 text-sm py-2 rounded-lg px-4 ${className}`}
>
    {text}
    <SiMicrosoftexcel className="transform text-[16px] transition-transform duration-300 group-hover:translate-x-1" />
</button>

  );
};

export default ExcelButtonComponent;
