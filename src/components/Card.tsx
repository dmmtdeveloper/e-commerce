import React, { useState } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Spinner from "./Spinner";
import { LucideIcon, ShoppingBag } from "lucide-react";
import { Producto } from "@/types/producto";
import { Button } from "./Button";

interface CardProps{
    className?: string;
    producto: Producto;
    onComprar: (producto: Producto) => void;
}


export const Card: React.FC<CardProps> = ({ className, producto, onComprar }) => {
    const [expandido, setExpandido] = useState(false);

    const handleCompara = () => {
        onComprar(producto);
    };

    const handleCardClick = () => {
        setExpandido(!expandido);
    };

    return (
        <div className={cn("group relative", className)}>
            <div
                className="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-lg overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                 <img
                    src="https://via.placeholder.com/300x200"
                    alt={producto.nombre}
                    className="w-full h-48 object-cover mb-4 rounded-md"
                />
            </div>
              {/* Nombre del producto */}
      <h2 className="text-lg font-bold pl-2 text-gray-800">{producto.nombre}</h2>

{/* Si está expandido, mostramos la descripción completa */}
{expandido && (
  <>
    <p className="text-gray-600 mb-2">{producto.descripcion}</p>
    <p className="text-gray-800 font-semibold mb-4">Stock: {producto.stock}</p>
  </>
)}

{/* Precio del producto */}
<p className="text-gray-800 font-small mb-2 text-lg py-2 pl-2">Precio: ${producto.precio}</p>

{/* Botón para comprar */}
<Button
  variant="primary"
  className="w-full mb-2"
  onClick={handleCompara}
  disabled={producto.stock === 0}
  startIcon={ShoppingBag}
>
  Comprar
</Button>
        </div>
    )
}