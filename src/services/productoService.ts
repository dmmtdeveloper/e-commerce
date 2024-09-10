import { Producto } from '../types/producto';

// Función para obtener productos desde la API
export async function obtenerProductos(): Promise<Producto[]> {

    try {
        const res = await fetch('https://proyectosocius-hnfjbhheebgefpc7.eastus2-01.azurewebsites.net/api/Productos');
        if (!res.ok) {
            throw new Error(`Error al obtener los productos: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        return [];
    }
}