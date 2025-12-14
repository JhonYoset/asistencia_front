export interface Justificacion {
  id?: number;
  username: string;
  nombreCompleto?: string;
  fecha: Date | string;
  tipo: string;
  motivo: string;
  estado: string;
  fechaSolicitud: string;
}

export interface JustificacionRequest {
  fecha: Date;
  tipo: 'TARDANZA' | 'AUSENCIA';
  motivo: string;
}