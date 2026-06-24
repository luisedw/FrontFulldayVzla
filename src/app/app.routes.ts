import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './components/home/home';
import { TourDetail } from './components/tour-detail/tour-detail';
import { RegistroComponent } from './components/registro/registro';
import { LoginComponent } from './components/login/login';
import { FormsModule } from '@angular/forms'; // <--- Importante
import { PromocionesComponent } from './components/promociones/promociones';
import { CrearPaqueteComponent } from './components/crearPaquetesTuristicos/crear-paquete.component';

export const routes: Routes = [
// 1. Ruta principal (Home)
  { path: '', component: HomeComponent },

  // 2. Rutas específicas de tu aplicación
  { path: 'tour/:id', component: TourDetail },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'destinos', loadComponent: () => import('./components/destinos/destinos.component').then(m => m.DestinosComponent) },
  { path: 'promociones', component: PromocionesComponent },
  { path: 'perfil', loadComponent: () => import('./components/perfil/perfil.component').then(m => m.PerfilComponent)},
  { path: 'admin/crear-paquete', component: CrearPaqueteComponent },

  // 3. Ruta comodín (SIEMPRE al final de todo)
  // Si el usuario escribe cualquier cosa loca en la URL, lo mandamos al Home
  { path: '**', redirectTo: '', pathMatch: 'full' }
];


export class AppRoutingModule { }