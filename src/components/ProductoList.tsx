"use client";

import { useEffect, useState } from 'react';
import { obtenerProductos } from '../services/productoService';
import { ProductoCard } from '../components/ProductoCard';
import { Producto } from '../types/producto';


export const ProductoList: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

    // Funcion para obtener productos
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const productos = await obtenerProductos();
                setProductos(productos);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        };
        fetchProductos();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6 px-2 mb-6 w-full">
            {productos.length > 0 ? (
                productos.map((producto) => (
                    <ProductoCard 
                    key={producto.productoId} 
                    producto={producto} 
                    />
                ))
            ): (
                <p>No hay productos disponibles.</p>
            )
            }
        </div>
    );
}