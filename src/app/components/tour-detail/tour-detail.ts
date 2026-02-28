import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TourService } from '../../services/tour';
import { Tour } from '../../models/tour.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.css'
})
export class TourDetail implements OnInit {
  tour?: Tour;

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
}