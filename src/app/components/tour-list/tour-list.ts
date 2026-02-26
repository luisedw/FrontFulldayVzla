import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourCardComponent } from '../tour-card/tour-card';
import { Tour } from '../../models/tour.model';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule, TourCardComponent], // Importamos la tarjeta aquí
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css'
})
export class TourListComponent {
  // Simulando el JSON que vendría de Spring Boot
  misTours: Tour[] = [
    {
      id: 1,
      destino: 'Morrocoy',
      titulo: 'Cayo Sombrero Premium',
      precio: 45,
      descripcion: 'Transporte ejecutivo, desayuno, almuerzo y lancha rápida.',
      imagenUrl: 'https://images.unsplash.com/photo-1628035153200-d32690f05814?w=600',
      puntuacion: 4.9,
      servicios: ['bus', 'food', 'water', 'guide']
    },
    {
      id: 2,
      destino: 'La Guaira',
      titulo: 'Los Caracas Relax',
      precio: 25,
      descripcion: 'Día de playa total con hidratación y transporte cómodo.',
      imagenUrl: 'https://images.unsplash.com/photo-1590577976322-3d231871f9dd?w=600',
      puntuacion: 4.5,
      servicios: ['bus', 'water']
    },
    {
      id: 3,
      destino: 'Miranda',
      titulo: 'Birongo y Tambores',
      precio: 35,
      descripcion: 'Ruta del chocolate y río con guía cultural incluido.',
      imagenUrl: 'https://images.unsplash.com/photo-1589394815304-d6af7516cf60?w=600',
      puntuacion: 4.8,
      servicios: ['bus', 'food', 'guide']
    }
  ];
}