import { Component, Input } from '@angular/core'; // Importamos Input
import { Tour } from '../../models/tour.model';

@Component({
  selector: 'app-tour-card',
  standalone: true,
  imports: [], 
  templateUrl: './tour-card.html',
  styleUrl: './tour-card.css'
})
export class TourCardComponent {
  // Aquí recibimos el objeto desde el padre
  @Input() tourData!: Tour; 
}