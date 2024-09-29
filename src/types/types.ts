export interface InputPasswordProps {
  type?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  icon?: React.ReactNode; // Ícono opcional para mostrar dentro del input
  onIconClick?: () => void; // Evento opcional para manejar clics en el ícono
  onMouseDown?: () => void; // Evento para detectar cuando se presiona el ícono
  onMouseUp?: () => void; // Evento para detectar cuando se suelta el ícono
}

export interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}


export interface DetallePedido {
  foto: boolean;
  pedidoDetalleId: number;
  pedidoId: number;
  productoId: number;
  cantidad: number;
  precioTotal: number;
}

export interface Pedido {
  pedidoId: number;
  token: string;
  estadoId: number;
  estadoNombre: string;
  cantidad: number;
  valorTotal: number;
  fecha: string;
  eliminado: boolean;
  detalles: DetallePedido[];
}

export interface PedidoDto {
  pedidoId: number;
  token: string;
  estadoId: number;
  estadoNombre: string;
  cantidad: number;
  valorTotal: number;
  fecha: string;
  eliminado: boolean;
}

export interface PedidoDetalleDTO {
  pedidoDetalleId: number;
  pedidoId: number;
  productoId: number;
  productoNombre: string;
  productoDescripcion: string;
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
  foto: string;
  nombreFoto: string;
  extension: string;
}