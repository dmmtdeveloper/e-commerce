import React from "react";

interface ButtonSettingProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLButtonElement>) => void;
  text: string;
  className?: string;
  type?: "button" | "submit" | "reset"; // Opciones para el tipo de botón, por defecto será "submit"
  isSubmitting?: boolean;
}

const ButtonCtaComponent: React.FC<ButtonSettingProps> = ({
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
      className={`bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-gray-100 text-sm py-2  rounded-lg px-4 ${className}`}
    >
      {text}
    </button>
  );
};

export default ButtonCtaComponent;
