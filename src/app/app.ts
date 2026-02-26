import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa tus componentes recién creados
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { TourListComponent } from './components/tour-list/tour-list';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  // ¡IMPORTANTE! Debes incluirlos aquí para que funcionen en el HTML
  imports: [
    CommonModule, 
    NavbarComponent, 
    HeroComponent, 
    TourListComponent, 
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'FrontFulldayVzla';
}