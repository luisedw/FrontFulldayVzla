import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TourService } from '../../services/tour';
import { Tour } from '../../models/tour.model';
import { CommonModule } from '@angular/common';

declare var Swal: any;

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.css'
})
export class TourDetail implements OnInit {
  tour?: Tour;

  constructor(
    private route: ActivatedRoute, 
    private tourService: TourService 
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.tourService.getTourByIdRemote(id).subscribe({
      next: (response: any) => {
        // Si tu backend devuelve un objeto individual directo o envuelto en data
        const item = response.data || response;
        
        // 💡 MAPEAMOS: Estructuramos el Tour individual
        this.tour = {
          id: item.id,
          titulo: item.nombre,
          descripcion: item.descripcion || 'Explora este increíble destino turístico con todo incluido.',
          destino: item.ciudad?.nombre || 'Venezuela',
          precio: item.precio || 45,
          imagenUrl: item.imagenUrl || 'assets/img/CayoSombrero.jpg',
          puntuacion: item.puntuacion || 4.8,
          servicios: item.servicios || ['bus', 'food', 'water', 'guide'],
          galeria: item.galeria || []
        };
      },
      error: (err: any) => {
        console.error('Error al obtener el detalle del tour:', err);
      }
    });
  }

  confirmarReserva(fecha: string, personas: string) {
    if (!fecha) {
      Swal.fire({
        icon: 'warning',
        title: '¡Ups!',
        text: 'Por favor selecciona una fecha para tu viaje.',
        confirmButtonColor: '#0dcaf0'
      });
      return;
    }

    const total = (this.tour?.precio || 0) * Number(personas);

    Swal.fire({
      title: '¡Reserva confirmada!',
      html: `
        <div class="text-start mt-3">
          <p><b>Destino:</b> ${this.tour?.titulo}</p>
          <p><b>Fecha:</b> ${fecha}</p>
          <p><b>Viajeros:</b> ${personas}</p>
          <hr>
          <p class="fs-4 text-center text-primary"><b>Total a pagar: $${total}</b></p>
        </div>
      `,
      icon: 'success',
      showConfirmButton: true,
      confirmButtonText: '¡Genial, nos vemos allá!',
      confirmButtonColor: '#0dcaf0'
    });
  }

  getServicioIcon(servicio: string): string {
    const iconos: { [key: string]: string } = {
      'bus': 'bi-bus-front',
      'car': 'bi-car-front',
      'food': 'bi-egg-fried',
      'breakfast': 'bi-egg-fried',
      'lunch': 'bi-cup-hot-fill',
      'water': 'bi-droplet-fill',
      'guide': 'bi-person-badge',
      'boat': 'bi-water',
      'insurance': 'bi-shield-check',
      'snorkeling': 'bi-mask'
    };
    return iconos[servicio.toLowerCase()] || 'bi-star';
  }
}