"use client";

import { useEffect, useState } from 'react';
import { obtenerProductos } from '../services/productoService';
import { ProductoCard } from '../components/ProductoCard';
import { Producto } from '../types/producto';
import { SearchBar } from './SearchBar';


export const ProductoList: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Funcion para obtener productos
    useEffect(() => {
        const fetchProductos = async () => {
          setLoading(true);
          try {
            const productosData = await obtenerProductos();
            setProductos(productosData);
            setProductosFiltrados(productosData);  // Inicialmente muestra todos los productos
          } catch (error) {
            console.error('Error al obtener los productos:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProductos();
      }, []);

    // Filtrar productos en función de la búsqueda
    useEffect(() => {
        console.log("Valor de búsqueda:", busqueda);
        console.log("Productos actuales:", productos); 

        if (busqueda.trim() === '') {
        setProductosFiltrados(productos);  // Si no hay búsqueda, mostramos todos los productos
        console.log("No hay búsqueda");
        } else {
        const productosFiltrados = productos.filter((producto) =>
            producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
        );
        console.log("Productos filtrados:", productosFiltrados);
        setProductosFiltrados(productosFiltrados);
        }
    }, [busqueda, productos]);

    // Fonction pour gérer l'achat
  const handleComprar = (producto: Producto) => {
    alert(`Vous avez ajouté "${producto.nombre}" au panier!`);
    // Ici, tu peux ajouter la logique pour ajouter le produit au panier
  };

    return (
        <div className="max-w-[970px] w-full p-6 rounded-lg md:p-12">
            <SearchBar value={busqueda} 
            onChange={(value) => {
                setBusqueda(value)
            }} />

            {/* Lista de productos */}
           {
               loading ? (
                <p>Cargando...</p>
               ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {productosFiltrados.length > 0 ? (
                        productosFiltrados.map((producto) => (
                            <ProductoCard 
                            key={producto.productoId} 
                            producto={producto}
                            onComprar={handleComprar}
                            />
                        ))
                        
            ): (
                <p className="text-center text-gray-500">No hay productos disponibles.</p>
            )
            }
           </div>
               )
           }
        </div>
    );
}