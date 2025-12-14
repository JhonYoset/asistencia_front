export interface UsuarioResponse {
  id?: number; 
  username: string;
  password?: string;
  nombre: string;
  rol: string;
  enabled?: boolean;
  fechaCreacion?: Date | string;
  ultimoAcceso?: Date | string;
  totalAsistencias?: number;
}