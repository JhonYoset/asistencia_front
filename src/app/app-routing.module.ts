import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { sessionGuard } from '@core/guards/session.guard';
import { roleGuard } from '@core/guards/role.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'empleado',
    loadChildren: () => import('./modules/asistencia/asistencia.module').then(m => m.AsistenciaModule),
    canActivate: [sessionGuard],
    data: { role: 'EMPLEADO' }
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [sessionGuard, roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: '',
    redirectTo: '/empleado/checkin',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/empleado/checkin'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }