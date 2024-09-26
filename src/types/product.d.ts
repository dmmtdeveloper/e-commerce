export interface Product {
  productoId: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockReservado: number;
  habilitado: boolean;
  eliminado: boolean;
  foto:string;
}
