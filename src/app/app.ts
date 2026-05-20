import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa tus componentes
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';

// 1. CAMBIA ESTA LÍNEA: Importa solo RouterOutlet, no RouterModule
import { RouterOutlet } from '@angular/router'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    FooterComponent,
    RouterOutlet // 2. CAMBIA ESTA LÍNEA TAMBIÉN: Deja solo RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'FrontFulldayVzla';
}