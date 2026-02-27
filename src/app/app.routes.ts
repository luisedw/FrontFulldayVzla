import { Routes } from '@angular/router';
import { Home} from './components/home/home';
import { TourDetail } from './components/tour-detail/tour-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '', component: Home},
// Agregamos la ruta que recibe un parámetro ':id'
  { path: 'tour/:id', component: TourDetail },
  { path: '**', redirectTo: '' }
];