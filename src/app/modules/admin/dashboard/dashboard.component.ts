import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts'; // Importar BaseChartDirective
import { AdminService } from 'src/app/services/admin.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  estadisticas: any = {};
  cargando: boolean = false;

  // Gráfico de barras - Asistencia por día
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Asistencias', backgroundColor: '#36A2EB' }
    ]
  };

  // Gráfico de dona - Puntualidad
  public donutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };
  public donutChartType: ChartType = 'doughnut';
  public donutChartData: ChartData<'doughnut'> = {
    labels: ['Puntual', 'Tardanza', 'Ausente'],
    datasets: [
      { data: [0, 0, 0], backgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384'] }
    ]
  };

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargando = true;
    this.adminService.getEstadisticas().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.actualizarGraficos(data);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
        this.cargando = false;
      }
    });
  }

  actualizarGraficos(data: any): void {
    // Actualizar gráfico de barras
    this.barChartData.labels = data.dias || [];
    this.barChartData.datasets[0].data = data.asistenciasPorDia || [];
    
    // Actualizar gráfico de dona
    this.donutChartData.datasets[0].data = [
      data.puntuales || 0,
      data.tardanzas || 0,
      data.ausencias || 0
    ];

    // Forzar actualización de gráficos
    if (this.chart) {
      this.chart.update();
    }
  }
}