import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero'; // Ajusta la ruta si es necesario
import { TourListComponent } from '../tour-list/tour-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, TourListComponent], // <--- Registramos los componentes aquí
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent { }