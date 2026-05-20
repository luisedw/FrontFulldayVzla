import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [], // Si usas iconos de Bootstrap no necesitas importar nada aquí
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  isLogged: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Escuchamos en tiempo real si el usuario inicia o cierra sesión
    this.authService.isLoggedIn().subscribe(status => {
      this.isLogged = status;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}