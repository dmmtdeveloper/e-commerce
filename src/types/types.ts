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
