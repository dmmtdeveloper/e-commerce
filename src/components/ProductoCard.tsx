"use client"; 

import { useState } from 'react';
import { Producto } from '../types/producto';

interface ProductoCardProps {
  producto: Producto;
}

export const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Function para expandir la descripción del producto
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };


  return (
    <div className="bg-white rounded-lg overflow-hidden ring-opacity-40 max-w-sm" onClick={toggleExpand} >
        {/* imagen del producto */}
        <div className="relative">
            <img
                className="w-full h-64 object-cover"
                src="https://via.placeholder.com/300x200"
                alt="Imagen del producto"
            />
            <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">SALE
            </div>
        </div>
        <h2 className="text-xl text-gray-500 font-bold px-4 mb-4 truncate w-full">{producto.nombre}</h2>
      {/* Detalles adicionales (solo visibles cuando está expandido) */}
      {isExpanded && (
        <div className="px-4 mt-4" >
          <p className="text-gray-600 mb-2">{producto.descripcion}</p>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Stock: {producto.stock}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-900 font-semibold">Precio: ${producto.precio}</span>
            <button className="bg-blue-500 text-white px-4 py-2 mt-4 mb-2 rounded-md hover:bg-blue-600">
                Comprar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
