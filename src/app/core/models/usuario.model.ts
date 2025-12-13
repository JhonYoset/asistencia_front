export interface Usuario {
  username: string;
  password?: string;
  nombre: string;
  rol: 'ADMIN' | 'EMPLEADO';
  enabled?: boolean;
}