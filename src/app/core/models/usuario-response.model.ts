export interface UsuarioResponse {
  id?: number; // ← Cambia a opcional
  username: string;
  password?: string;
  nombre: string;
  rol: string;
  enabled?: boolean;
  fechaCreacion?: Date | string;
  ultimoAcceso?: Date | string;
  totalAsistencias?: number;
}