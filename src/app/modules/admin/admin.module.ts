import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JustificacionesComponent } from './justificaciones/justificaciones.component';
import { ReportesComponent } from './reportes/reportes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    DashboardComponent,
    JustificacionesComponent,
    ReportesComponent,
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule
  ]
})
export class AdminModule { }