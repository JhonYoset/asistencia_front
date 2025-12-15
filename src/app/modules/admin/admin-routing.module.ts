import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JustificacionesComponent } from './justificaciones/justificaciones.component';
import { ReportesComponent } from './reportes/reportes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'justificaciones', component: JustificacionesComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }