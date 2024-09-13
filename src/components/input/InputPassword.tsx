import React from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  icon?: React.ReactNode; // Añadimos un prop para el icono
  onIconClick?: () => void; // Añadimos un prop para manejar el clic del icono
  onMouseDown?: () => void; // Evento para detectar cuando se mantiene presionado el ícono
  onMouseUp?: () => void; // Evento para detectar cuando se suelta el ícono
}

export const Input: React.FC<InputProps> = ({
  type = "text",
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
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="true"
        className="border border-slate-300 py-2 px-4 w-full rounded-xl focus:outline-none" // Deja espacio a la derecha para el ícono
      />
      {icon && (
        <button
          type="button"
          onMouseDown={onMouseDown} // Al hacer clic y mantener
          onMouseUp={onMouseUp} // Al soltar el clic
          onMouseLeave={onMouseUp} // Para ocultar la contraseña si el mouse sale del botón sin soltar
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 "
        >
          {icon}
        </button>
      )}
    </div>
  );
};