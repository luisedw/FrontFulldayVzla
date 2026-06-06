import { Component } from '@angular/core';
import { TourService } from '../../services/tour'; // 💡 Ajusta la ruta si es necesario

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class HeroComponent {
  
  constructor(private tourService: TourService) {} // 💡 Inyectamos el servicio

  ejecutarBusqueda(valor: string) {
    this.tourService.setFiltro(valor); // Enviamos el string al canal del servicio
  }
}