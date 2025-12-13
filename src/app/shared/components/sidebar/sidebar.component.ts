import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];
  isAdmin: boolean = false;
  username: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.isAdmin = this.authService.getUserRoles().includes('ROLE_ADMIN');
    this.loadMenu();
  }

  loadMenu(): void {
    if (this.isAdmin) {
      this.menuItems = [
        { name: 'Dashboard', icon: 'fas fa-tachometer-alt', router: ['/admin/dashboard'] },
        { name: 'Justificaciones', icon: 'fas fa-file-signature', router: ['/admin/justificaciones'] },
        { name: 'Reportes', icon: 'fas fa-chart-bar', router: ['/admin/reportes'] },
        { name: 'Usuarios', icon: 'fas fa-users', router: ['/admin/usuarios'] }
      ];
    } else {
      this.menuItems = [
        { name: 'Registro', icon: 'fas fa-clock', router: ['/empleado/checkin'] },
        { name: 'Historial', icon: 'fas fa-history', router: ['/empleado/historial'] },
        { name: 'Justificaciones', icon: 'fas fa-file-alt', router: ['/empleado/justificacion'] }
      ];
    }
  }

  logout(): void {
    this.authService.logout();
  }
}