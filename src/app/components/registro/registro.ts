import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [FormsModule
    
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
  
})
export class RegistroComponent {
  // Ajusta estos campos según el JSON exacto de entrada que usas en el POST de Postman
  userData = {
    username: '',
    email: '',
    password: '',
    password_confirm: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.userData).subscribe({
      next: (res) => {
        alert('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']); // Lo mandamos al login para que obtenga su token
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
      }
    });
  }
}