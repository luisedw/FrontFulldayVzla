import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PromocionesService } from '../../services/promociones.service'; // 👈 Importamos tu nuevo servicio
import { Paquete } from '../../models/paquete.model';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './promociones.html',
  styleUrl: './promociones.css'
})
export class PromocionesComponent implements OnInit {
  listaPaquetes: Paquete[] = [];
  loading: boolean = true;

  constructor(private promocionesService: PromocionesService) {} // 👈 Inyectamos el servicio aquí

  ngOnInit(): void {
    // 📡 Consumimos el servicio de manera limpia
    this.promocionesService.getPaquetes().subscribe({
      next: (response) => {
        if (response.estatus === 'success') {
          this.listaPaquetes = response.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando paquetes:', err);
        this.loading = false;
      }
    });
  }

  getFormatedImage(url: string): string {
    if (url.includes('paquete_placeholder.jpg') || !url) {
      return 'assets/img/CayoSombrero.jpg';
    }
    return `http://127.0.0.1:8000${url}`; 
  }
}