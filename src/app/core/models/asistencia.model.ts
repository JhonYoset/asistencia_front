export interface Asistencia {
  id?: number;
  nombreEmpleado?: string;
  entrada?: Date;
  salida?: Date;
  estado?: string;
  fechaRegistro?: string;
  usuarioId?: number; // ← Agrega si necesitas referenciar al usuario
}

export interface AsistenciaRequest {
  accion: 'CHECKIN' | 'CHECKOUT';
}