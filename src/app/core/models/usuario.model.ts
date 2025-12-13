export interface Usuario {
  username: string;
  password?: string;
  nombre: string;
  rol: string;  // ← Cambia aquí: de 'ADMIN' | 'EMPLEADO' a string
  enabled?: boolean;
}