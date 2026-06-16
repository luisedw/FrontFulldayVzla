import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

// 💡 Definimos el modelo exacto de tu JSON
export interface PayloadTokenModel {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://127.0.0.1:8000/api/auth/login/';
  private registerUrl = 'http://127.0.0.1:8000/api/auth/register/'; 
  private logoutTimer: any = null; 

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  
  // 💡 1. Creamos el BehaviorSubject global con el tipo de tu modelo
  private payloadTokenModel = new BehaviorSubject<PayloadTokenModel | null>(this.getUserFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // 💡 2. Lee el localStorage al arrancar o devuelve null si no existe
  private getUserFromStorage(): PayloadTokenModel | null {
    const userStr = localStorage.getItem('user_data');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as PayloadTokenModel;
    } catch (e) {
      return null;
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // 💡 3. Expone el payload de forma reactiva para cualquier módulo/componente
  getPayloadToken(): Observable<PayloadTokenModel | null> {
    return this.payloadTokenModel.asObservable();
  }

  // 💡 4. Atajo rápido para obtener el valor síncrono instantáneo sin suscribirse
  get currentPayloadValue(): PayloadTokenModel | null {
    return this.payloadTokenModel.value;
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.authUrl}`, credentials).pipe(
      tap(response => {
        const accessToken = response?.access || response?.data?.access || response?.data?.access_token;
        const refreshToken = response?.refresh || response?.data?.refresh || response?.data?.refresh_token;
        const userData = response?.user || response?.data?.user;

        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
          
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
          
          if (userData) {
            localStorage.setItem('user_data', JSON.stringify(userData));
            // 💡 5. Emitimos los datos del usuario a toda la aplicación de inmediato
            this.payloadTokenModel.next(userData); 
          }

          this.loggedIn.next(true); 
          this.configurarAutoLogout();
          console.log('Tokens y datos de usuario almacenados en el AuthService con éxito.');
        } else {
          console.warn('Se recibió respuesta del servidor, pero no se encontró un "access_token" válido.', response);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    // 💡 6. Reseteamos el modelo a null globalmente
    this.payloadTokenModel.next(null); 
    this.loggedIn.next(false); 
    this.router.navigate(['/login']);
  }

  private configurarAutoLogout() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecodificado = JSON.parse(atob(payloadBase64));
      const tiempoExpiracion = payloadDecodificado.exp * 1000;
      const tiempoRestante = tiempoExpiracion - Date.now();

      if (tiempoRestante > 0) {
        if (this.logoutTimer) clearTimeout(this.logoutTimer);

        this.logoutTimer = setTimeout(() => {
          console.warn('La sesión ha expirado por límite de tiempo.');
          this.logout();
        }, tiempoRestante);
      } else {
        this.logout();
      }
    } catch (error) {
      console.error('Error al calcular la expiración del token:', error);
      this.logout();
    }
  }
}