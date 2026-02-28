import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourCardComponent } from '../tour-card/tour-card';
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour'; // Importar el servicio
@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule, TourCardComponent], // Importamos la tarjeta aquí
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css'
})
export class TourListComponent implements OnInit{
  // Simulando el JSON que vendría de Spring Boot
  misTours: Tour[] = []
  // Inyectamos el servicio en el constructor (Como en Spring Boot)
  constructor(private tourService: TourService) {}

ngOnInit(): void {
  // Al iniciar, pedimos los tours
this.tourService.getToursLocal().subscribe({
  next: (data: Tour[]) => { // <-- Importante el : Tour[]
    this.misTours = data;
  },
  error: (err: any) => {    // <-- Importante el : any
    console.error(err);
  }
});
}
}
