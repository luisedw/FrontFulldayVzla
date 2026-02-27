import { Component, Input } from '@angular/core'; // Importamos Input
import { Tour } from '../../models/tour.model';
import { RouterModule } from '@angular/router'; // <--- 1. Importa esto

@Component({
  selector: 'app-tour-card',
  standalone: true,
  imports: [RouterModule], // <--- 2. Agrégalo aquí
  templateUrl: './tour-card.html',
  styleUrl: './tour-card.css'
})
export class TourCardComponent {
  // Aquí recibimos el objeto desde el padre
  @Input() tourData!: Tour; 
}