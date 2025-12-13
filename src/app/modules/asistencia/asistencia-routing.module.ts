import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinOutComponent } from './checkin-out/checkin-out.component';
import { HistorialComponent } from './historial/historial.component';
import { JustificacionSolicitudComponent } from './justificacion-solicitud/justificacion-solicitud.component';

const routes: Routes = [
  { path: 'checkin', component: CheckinOutComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'justificacion', component: JustificacionSolicitudComponent },
  { path: '', redirectTo: 'checkin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsistenciaRoutingModule { }