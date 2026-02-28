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

  constructor(
    private route: ActivatedRoute, // Para leer la URL
    private tourService: TourService // Para buscar los datos
  ) {}

  ngOnInit(): void {
    // Obtenemos el ID de la URL (ej: /tour/1)
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Buscamos el tour en nuestro "servicio"
    this.tourService.getToursLocal().subscribe(tours => {
      this.tour = tours.find(t => t.id === id);
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
    
    // Si no encuentra el servicio, devuelve una estrella por defecto
    return iconos[servicio.toLowerCase()] || 'bi-star';
  }
}