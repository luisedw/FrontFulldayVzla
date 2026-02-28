import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa tus componentes recién creados
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { TourListComponent } from './components/tour-list/tour-list';
import { FooterComponent } from './components/footer/footer';
import { RouterModule } from '@angular/router'; // <--- 1. Importar esto

@Component({
  selector: 'app-root',
  standalone: true,
  // ¡IMPORTANTE! Debes incluirlos aquí para que funcionen en el HTML
  imports: [
    CommonModule, 
    NavbarComponent, 
    FooterComponent,
    RouterModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'FrontFulldayVzla';
}