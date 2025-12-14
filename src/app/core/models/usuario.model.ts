export interface Usuario {
  id?: number;
  username: string;
  password?: string;
  nombreCompleto: string;
  rol: string;
  enabled?: boolean;
  fechaCreacion?: Date | string;
  ultimoAcceso?: Date | string;
  totalAsistencias?: number;
} 