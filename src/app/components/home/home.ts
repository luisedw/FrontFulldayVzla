import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero'; // Ajusta la ruta si es necesario
import { TourListComponent } from '../tour-list/tour-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, TourListComponent], // <--- Registramos los componentes aquí
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent { 
  
  terminoBusqueda: string = ''; // Enlazado con ngModel al input del cintillo

  constructor(private router: Router) {}

  onBuscarTour() {
    // Redirige a /destinos llevando lo que el usuario escribió
    this.router.navigate(['/destinos'], { 
      queryParams: { buscar: this.terminoBusqueda } 
    });
  }
}