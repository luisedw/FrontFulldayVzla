import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule, // <--- 3. Agrégalo aquí para habilitar *ngIf
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  // Estos nombres deben coincidir EXACTAMENTE con las llaves del JSON que probaste en Postman
  credentials = {
    username: '',
    password: ''
  };
  
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('¡Token recibido con éxito!', response);
        this.router.navigate(['/']); // Al iniciar sesión con éxito, volvemos al Home
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'usuario o contraseña incorrectos. Inténtalo de nuevo.';
      }
    });
  }
}