import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './components/home/home';
import { TourDetail } from './components/tour-detail/tour-detail';
import { RegistroComponent } from './components/registro/registro';
import { LoginComponent } from './components/login/login';
import { FormsModule } from '@angular/forms'; // <--- Importante

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '', component: HomeComponent},
// Agregamos la ruta que recibe un parámetro ':id'
  { path: 'tour/:id', component: TourDetail },
  { path: '**', redirectTo: '' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    FormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }