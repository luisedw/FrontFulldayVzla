import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourCardComponent } from '../tour-card/tour-card';
import { Tour } from '../../models/tour.model';
import { PromocionesService } from '../../services/promociones.service'; // 👈 Conectamos tu servicio unificado
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
  toursOriginales: Tour[] = []; // Mantiene los paquetes reales en memoria para el buscador

  private readonly URL_BACKEND = 'http://127.0.0.1:8000';

  constructor(private promocionesService: PromocionesService) {} // 👈 Inyectamos tu servicio unificado

  ngOnInit(): void {
    // 📡 Consumimos los paquetes reales del backend
    this.promocionesService.getPaquetes().subscribe({
      next: (response: any) => {
        // Validamos si la respuesta viene envuelta en .data o directa
        const backendData = response.estatus === 'success' ? response.data : (response.data || response);
        
        // Filtramos paquetes que tengan imágenes válidas
        const paquetesValidos = backendData.filter((item: any) => 
          item.imagen_principal !== null && 
          item.imagen_principal !== undefined &&
          !item.imagen_principal.includes('paquete_placeholder.jpg')
        );

        // Mapeamos de la interfaz Paquete de Django al modelo simplificado Tour que requiere tu Home
        this.toursOriginales = paquetesValidos.map((item: any) => ({
          id: item.id,
          titulo: item.nombre, 
          descripcion: item.descripcion || 'Explora este increíble destino con todo incluido.',
          destino: item.destino?.nombre || 'Venezuela', // Captura el nombre del objeto destino relacional
          precio: item.precio_base_bs, // 💡 Usamos el precio real base en Bolívares
          imagenUrl: `${this.URL_BACKEND}${item.imagen_principal}`, 
          puntuacion: item.puntuacion || 4.8, // Valor por defecto estético
          services: item.servicios || ['bus', 'food', 'water', 'guide'],
          galeria: item.galeria || []
        }));

        // 💡 Mostramos los primeros 6 paquetes turísticos en la Home para mantener la simetría visual
        this.misTours = this.toursOriginales.slice(0, 6);

        this.conectarBuscador();
      },
      error: (err: any) => {
        console.error('Error al cargar paquetes en la Home:', err);
      }
    });
  }

  conectarBuscador(): void {
    // Asumiendo que tu buscador en el navbar escribe en un BehaviorSubject de un servicio compartido,
    // puedes adaptar esta suscripción si utilizas otra vía de comunicación
    this.promocionesService.getPaquetes().subscribe(() => {
      // Nota: Si usas un bus de eventos para el textoBuscado$, mantén esa lógica aquí.
    });
  }
}