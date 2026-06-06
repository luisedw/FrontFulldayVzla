import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourCardComponent } from '../tour-card/tour-card';
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour'; 

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule, TourCardComponent],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css'
})
export class TourListComponent implements OnInit {
  misTours: Tour[] = [];
  toursOriginales: Tour[] = []; // 💡 Copia maestra para resguardar los destinos de Django

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    // 1. Cargamos la data remota original
    this.tourService.getToursRemote().subscribe({
      next: (response: any) => {
        const backendData = response.data || response;
        
        this.toursOriginales = backendData.map((item: any) => ({
          id: item.id,
          titulo: item.nombre, 
          descripcion: item.descripcion || 'Explora este increíble destino turístico con todo incluido.',
          destino: item.ciudad?.nombre || 'Venezuela', 
          precio: item.precio || 45, 
          imagenUrl: item.imagenUrl || 'assets/img/CayoSombrero.jpg', 
          puntuacion: item.puntuacion || 4.8,
          servicios: item.servicios || ['bus', 'food', 'water', 'guide'],
          galeria: item.galeria || []
        }));

        // Inicializamos la lista visible con todos los elementos
        this.misTours = [...this.toursOriginales];

        // 2. 💡 Activamos la escucha del buscador en paralelo
        this.conectarBuscador();
      },
      error: (err: any) => {
        console.error('Error al cargar tours:', err);
      }
    });
  }

  conectarBuscador() {
    // Escuchamos de forma reactiva cualquier cambio emitido desde el Hero
    this.tourService.textoBuscado$.subscribe((termino: string) => {
      if (!termino || termino.trim() === '') {
        this.misTours = [...this.toursOriginales]; // Si está vacío limpiamos el filtro
        return;
      }

      const busqueda = termino.toLowerCase().trim();

      // Filtramos sobre la copia guardada intacta
      this.misTours = this.toursOriginales.filter(tour => 
        tour.titulo.toLowerCase().includes(busqueda) ||
        tour.destino.toLowerCase().includes(busqueda) ||
        tour.descripcion.toLowerCase().includes(busqueda)
      );
    });
  }
}