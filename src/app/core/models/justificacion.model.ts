export interface Justificacion {
  id?: number;
  username?: string;
  fecha: Date;
  tipo: 'TARDANZA' | 'AUSENCIA';
  motivo: string;
  estado?: string;
  fechaSolicitud?: string;
}

export interface JustificacionRequest {
  fecha: Date;
  tipo: 'TARDANZA' | 'AUSENCIA';
  motivo: string;
}