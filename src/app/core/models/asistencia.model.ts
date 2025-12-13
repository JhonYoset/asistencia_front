export interface Asistencia {
  id?: number;
  nombreEmpleado?: string;
  entrada?: Date;
  salida?: Date;
  estado?: string;
  fechaRegistro?: string;
}

export interface AsistenciaRequest {
  accion: 'CHECKIN' | 'CHECKOUT';
}