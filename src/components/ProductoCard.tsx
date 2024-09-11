"use client"; 
import { Heart} from 'lucide-react';
import { Producto } from '../types/producto';
import { Button } from './Button';
import { Card } from './Card';
import { cn } from '../../lib/utils';
import { useState } from 'react';

interface ProductoCardProps {
  producto: Producto;
  onComprar: (producto: Producto) => void;
}

export const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [expandido, setExpandido] = useState(false);

    const handleFavoriteToggle = async () => {
      setIsLoading(true);
      // Simular una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsFavorite(!isFavorite);
      setIsLoading(false);
    };

    const handleAddToCart = () => {
        // Agregar al carrito
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(producto);
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    // Función para mostrar el card al clickearlo
    const handleExpandir = () => {
      setExpandido(!expandido);
    }

    // Funccion para mostrar el card al clickearlo
    const handleCardClick = () => {
      console.log("Card clicked:", producto);
    };

  return (
    <div className="bg-white rounded-lg overflow-hidden ring-opacity-40 max-w-[267px]">
        {/* imagen del producto */}
        <div className="relative">
            <img
                className="w-full h-[250px] object-cover"
                src="https://via.placeholder.com/300x200"
                alt="Imagen del producto"
                onClick={handleCardClick}
            />
            {/* favorite producto */}
            <div className="h-4 w-4 absolute right-8 top-4">
                <Button
                    size="sm"
                    variant='ghost'
                    isLoading={false}
                    onClick={handleFavoriteToggle}
                    className={cn(
                      "rounded-full transition-colors transform-gpu ",
                      isFavorite ? "text-red-500 hover:bg-red-500" : "text-gray-300 hover:bg-red-500",
                      "active:scale-95"
                    )}
                >
                    {isFavorite ? "❤️" : "🤍" }
                </Button>
            </div>
        </div>
        <h2 className="text-xl py-2 text-gray-500 font-bold px-4 mb-4 truncate w-full">
          {producto.nombre}
        </h2>
      {/* Detalles adicionales (solo visibles cuando está expandido) */}
      {
        expandido ? ( 
          <div className="px-4">
            <Card className="w-full" producto={producto} onComprar={handleAddToCart} />
          </div>
         ):(
          <div className="px-4 mt-4 mb-5" >
          <p className="text-gray-600 mb-2">{producto.descripcion}</p>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Stock: {producto.stock}</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-gray-700 font-semibold mr-2 text-lg">Precio: ${producto.precio}</span>
          </div>
        </div>
         )
      }
    </div>
  );
};
