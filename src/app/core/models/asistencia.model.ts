export interface Asistencia {
  id?: number;
  nombreEmpleado?: string;
  entrada?: Date;
  salida?: Date;
  estado?: string;
  fechaRegistro?: string;
  usuarioId?: number;
}

export interface AsistenciaRequest {
  accion: 'CHECKIN' | 'CHECKOUT';
}