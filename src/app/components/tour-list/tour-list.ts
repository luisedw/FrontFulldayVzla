import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourCardComponent } from '../tour-card/tour-card';
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule, TourCardComponent, RouterLink],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css'
})
export class TourListComponent implements OnInit {
  misTours: Tour[] = [];
  toursOriginales: Tour[] = []; // Mantiene la base de datos completa de Django en memoria

  private readonly URL_BACKEND = 'http://127.0.0.1:8000';

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.tourService.getToursRemote().subscribe({
      next: (response: any) => {
        const backendData = response.data || response;
        
        const destinosValidos = backendData.filter((item: any) => 
          item.imagen_principal !== null && 
          item.imagen_principal !== undefined &&
          !item.imagen_principal.includes('placeholder')
        );

        this.toursOriginales = destinosValidos.map((item: any) => ({
          id: item.id,
          titulo: item.nombre, 
          descripcion: item.descripcion || 'Explora este increíble destino turístico con todo incluido.',
          destino: item.ciudad?.nombre || 'Venezuela', 
          precio: item.precio || 45, 
          imagenUrl: `${this.URL_BACKEND}${item.imagen_principal}`, 
          puntuacion: item.puntuacion || 4.8,
          services: item.servicios || ['bus', 'food', 'water', 'guide'],
          galeria: item.galeria || []
        }));

        // 💡 Inicializamos la lista visible mostrando SOLO los primeros 6 destinos
        this.misTours = this.toursOriginales.slice(0, 6);

        this.conectarBuscador();
      },
      error: (err: any) => {
        console.error('Error al cargar tours:', err);
      }
    });
  }

  conectarBuscador() {
    this.tourService.textoBuscado$.subscribe((termino: string) => {
      if (!termino || termino.trim() === '') {
        // 💡 Si el buscador está vacío, volvemos a mostrar solo los 6 principales
        this.misTours = this.toursOriginales.slice(0, 6);
        return;
      }

      const busqueda = termino.toLowerCase().trim();

      // Filtramos sobre la lista completa guardada en memoria
      const resultados = this.toursOriginales.filter(tour => 
        tour.titulo.toLowerCase().includes(busqueda) ||
        tour.destino.toLowerCase().includes(busqueda) ||
        tour.descripcion.toLowerCase().includes(busqueda)
      );

      // 💡 OPCIÓN: Mostramos máximo 6 resultados que coincidan para no romper la estética de la Home
      this.misTours = resultados.slice(0, 6);
    });
  }
}