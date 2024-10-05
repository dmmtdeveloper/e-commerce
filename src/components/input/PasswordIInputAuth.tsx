import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importamos los íconos de ojo abierto y cerrado
import clsx from "clsx";
import ErrorMessage from "../error-message-component/error-message";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  label?: string;
  name?: string;
  type?: string;
  isSubmitting?: boolean;
  placeholder?: string;
  className?: string;
  register: UseFormRegisterReturn;
  errorMessage?: string; // Para mostrar mensajes de error
  error?: FieldError;
 
}

const PasswordInputAuth: React.FC<PasswordInputProps> = ({
  label,
  name,
  type,
  isSubmitting = false,
  placeholder = "Ingresa tu contraseña",
  className,
  register,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar u ocultar la contraseña

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
       {label && (
        <label htmlFor={name} className="font-medium">
          {label}
        </label>
      )}
      <input
        {...register} // Esto se conecta con react-hook-form
        type={showPassword ? "text" : "password"} // Cambia entre texto y contraseña
        placeholder={placeholder}
        disabled={isSubmitting}
        className={`relative border border-slate-300${
          error
            ? "border border-slate-300 font-light py-2 px-4 w-full rounded-xl focus:outline-red-500"
            : "border border-slate-300 font-light py-2 px-4 w-full rounded-xl focus:outline-blue-400"
        }`}
      />

      {/* Ícono del ojo */}
      <span
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-3 cursor-pointer"
      >
        {showPassword ? (
          <FaEye className="text-gray-400" />
        ) : (
          <FaEyeSlash className="text-gray-400" />
        )}
      </span>

      {/* Mostrar mensaje de error si existe */}
      {error && <ErrorMessage message={error.message} />}
    </div>
  );
};

export default PasswordInputAuth;
