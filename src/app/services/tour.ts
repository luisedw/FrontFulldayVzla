import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Para el futuro
import { Observable, of } from 'rxjs';
import { Tour } from '../models/tour.model';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  // Tu URL de Spring Boot (Cámbiala según tu puerto)
  private apiUrl = 'http://localhost:8080/api/tours'; 

  private toursEjemplo: Tour[] = [
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
    }
  ];

  constructor(private http: HttpClient) { }

  // Método que usaremos ahora (simulado)
  getToursLocal(): Observable<Tour[]> {
    return of(this.toursEjemplo);
  }

  // Método que usaremos con Spring Boot
  getToursRemote(): Observable<Tour[]> {
    return this.http.get<Tour[]>(this.apiUrl);
  }
}


