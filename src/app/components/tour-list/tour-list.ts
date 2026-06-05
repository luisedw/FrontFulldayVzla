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

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.tourService.getToursRemote().subscribe({
      next: (response: any) => {
        const backendData = response.data || response;
        
        // 💡 MAPEAMOS: Convertimos la data del backend al formato que espera tu HTML de Tours
        this.misTours = backendData.map((item: any) => ({
          id: item.id,
          titulo: item.nombre, // 'nombre' pasa a ser 'titulo'
          descripcion: item.descripcion || 'Explora este increíble destino turístico con todo incluido.',
          destino: item.ciudad?.nombre || 'Venezuela', // Sacamos el nombre de la ciudad
          precio: item.precio || 45, // Si el backend no tiene precio, dejamos 45 por defecto
          imagenUrl: item.imagenUrl || 'assets/img/CayoSombrero.jpg', // Imagen de respaldo
          puntuacion: item.puntuacion || 4.8,
          servicios: item.servicios || ['bus', 'food', 'water', 'guide'],
          galeria: item.galeria || []
        }));
      },
      error: (err: any) => {
        console.error('Error al cargar tours:', err);
      }
    });
  }
}