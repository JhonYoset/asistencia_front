import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsistenciaRoutingModule } from './asistencia-routing.module';
import { CheckinOutComponent } from './checkin-out/checkin-out.component';
import { HistorialComponent } from './historial/historial.component';
import { JustificacionSolicitudComponent } from './justificacion-solicitud/justificacion-solicitud.component';
import { AsistenciaPageComponent } from './pages/asistencia-page/asistencia-page.component';

@NgModule({
  declarations: [
    CheckinOutComponent,
    HistorialComponent,
    JustificacionSolicitudComponent,
    AsistenciaPageComponent
  ],
  imports: [
    CommonModule,
    AsistenciaRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AsistenciaModule { }