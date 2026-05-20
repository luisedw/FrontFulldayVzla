import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Cambia la URL según el puerto de tu backend de Django
  private authUrl = 'http://127.0.0.1:8000/api/auth/login/';
  private registerUrl = 'http://127.0.0.1:8000/api/auth/register/'; 
  //private authUrl = 'http://127.0.0.1:8000/api/auth/';
  //private registerUrl = 'http://127.0.0.1:8000/api/clientes/'; 

  // Un BehaviorSubject nos permite notificar a toda la app (como al navbar) si el estado cambia
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // El Navbar se "suscribirá" a esta función para saber si cambia el estado
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Servicio de Login (Llama al JSON de Postman)
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.authUrl}`, credentials).pipe(
      tap(res => {
        if (res && res.access) {
          localStorage.setItem('access_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
          this.loggedIn.next(true); // Cambia el estado a conectado
        }
      })
    );
  }

  // Servicio de Registro (Envía los datos del nuevo cliente)
  register(userData: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData);
  }

  // Cerrar Sesión
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.loggedIn.next(false); // Cambia el estado a desconectado
  }
}