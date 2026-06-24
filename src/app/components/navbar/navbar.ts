import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { AuthService, PayloadTokenModel } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  isLogged: boolean = false;
  usuarioData: PayloadTokenModel | null = null;
  isDropdownOpen: boolean = false; 
  isSidebarOpen: boolean = false; // 👈 NUEVA VARIABLE: Controla el menú lateral

  constructor(
    private authService: AuthService, 
    private router: Router,
    private eRef: ElementRef 
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(status => {
      this.isLogged = status;
    });

    this.authService.getPayloadToken().subscribe(user => {
      this.usuarioData = user;
    });
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  esAdministrador(): boolean {
    if (!this.usuarioData || !this.usuarioData.roles || this.usuarioData.roles.length === 0) {
      return false; 
    }
    return this.usuarioData.roles.includes('2') || this.usuarioData.roles.includes(2 as any);
  }

  logout(): void {
    this.isDropdownOpen = false;
    this.isSidebarOpen = false; // 👈 Cerramos el menú al salir
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}