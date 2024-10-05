import { InputPasswordProps } from "@/types/types";
import React from "react";

export const InputPassword: React.FC<InputPasswordProps> = ({
  type = "text",
  name,
  placeholder = "",
  value,
  onChange,
  icon,
  onIconClick,
  onMouseDown,
  onMouseUp,
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="true"
        className="border border-slate-300 font-light py-2 px-4 w-full rounded-xl focus:outline-blue-400" // Añade espacio a la derecha para el ícono
      />
      {icon && (
        <button
          type="button"
          onClick={onIconClick} // Si se desea agregar una función de clic en el ícono
          onMouseDown={onMouseDown} // Al hacer clic y mantener presionado el ícono
          onMouseUp={onMouseUp} // Al soltar el clic del ícono
          onMouseLeave={onMouseUp} // Por si el mouse sale del botón sin soltarlo
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500"
        >
          {icon}
        </button>
      )}
    </div>
  );
};
