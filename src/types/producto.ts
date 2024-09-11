export interface Producto {
    href: string | undefined;
    productoId: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    stockReservado: number;
    habilitado: boolean;
    eliminado: boolean;
    img?: string; 
}