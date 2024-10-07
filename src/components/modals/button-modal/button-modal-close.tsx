import React from "react";

interface ButtonSetting {
  onClick?: () => void;
  text: string;
  className?: string;
  type?: "button" | "submit" | "reset"; // Opciones para el tipo de botón, por defecto será "submit"
  isSubmitting?: boolean;
}

const ButtonModalClose: React.FC<ButtonSetting> = ({
  isSubmitting,
  onClick,
  text,
  className,
  type,
}) => {
  return (
    <button
      disabled={isSubmitting}
      type={type}
      onClick={onClick}
      className={`bg-green-400 hover:bg-green-500 text-gray-100 transition-all duration-300 text-sm py-2  rounded-lg px-4 ${className}`}
    >
      {text}
    </button>
  );
};

export default ButtonModalClose;
