import apiConfig from '../../apiConfig';
import { Producto } from '../types/producto';

// Función para obtener productos desde la API
export async function obtenerProductos(): Promise<Producto[]> {
    const res = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.productos}`);
    
    if (!res.ok) {
      throw new Error(`Error al obtener los productos: ${res.statusText}`);
    }
    return await res.json();
  }