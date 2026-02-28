import { Routes } from '@angular/router';
import { HomeComponent} from './components/home/home';
import { TourDetail } from './components/tour-detail/tour-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '', component: HomeComponent},
// Agregamos la ruta que recibe un parámetro ':id'
  { path: 'tour/:id', component: TourDetail },
  { path: '**', redirectTo: '' }
];