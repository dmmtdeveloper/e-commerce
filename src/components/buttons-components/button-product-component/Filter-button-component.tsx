import React from 'react';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';

interface ButtonFilterComponent {
  text: string;
  onclick: () => void;
  className: string;
  isPanelCollapsed: boolean; // Recibe el estado desde el componente padre
}

const FilterButtonComponent: React.FC<ButtonFilterComponent> = ({ text, onclick, className, isPanelCollapsed }) => {
  return (
    <button
      className={`text-blue-500 hover:text-blue-600 text-sm flex items-center justify-center ${className}`}
      onClick={onclick} // Ejecuta la función onclick pasada por props
    >
      {/* Renderiza el ícono dinámicamente según el estado isPanelCollapsed */}
      {isPanelCollapsed ? (
        <>
          <GoChevronDown className="text-2xl mr-2" /> {text || 'Mostrar filtros'}
        </>
      ) : (
        <>
          <GoChevronUp className="text-2xl mr-2" /> {text || 'Ocultar filtros'}
        </>
      )}
    </button>
  );
};

export default FilterButtonComponent;
