import clsx from "clsx";
import React from "react";

interface SubmitButtonProps {
  isSubmitting?: boolean;
  text: string;
  type?: "button" | "submit" | "reset"; // Opciones para el tipo de botón, por defecto será "submit"
  className?: string; // Para pasar clases de estilo adicionales si es necesario
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  text,
  type = "submit",
  className,
}) => {
  return (
    <button
      disabled={isSubmitting}
      type={type}
      className={clsx(
        className, // Aquí pasamos las clases adicionales si existen
        "bg-blue-500",
        "text-white",
        "py-3 rounded-xl",
        "hover:bg-blue-600",
        "transition-all",
        { "opacity-50 cursor-not-allowed": isSubmitting } // Aplica estilos condicionales cuando está deshabilitado
      )}
    >
      {isSubmitting ? "Cargando..." : text}
    </button>
  );
};

export default SubmitButton;
