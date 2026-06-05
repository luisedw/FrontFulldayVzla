import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Cambia la URL según el puerto de tu backend de Django
  private authUrl = 'http://127.0.0.1:8000/api/auth/login/';
  private registerUrl = 'http://127.0.0.1:8000/api/auth/register/'; 
  //private authUrl = 'http://127.0.0.1:8000/api/auth/';
  //private registerUrl = 'http://127.0.0.1:8000/api/clientes/'; 
  private logoutTimer: any = null; // 💡 Inicializado en null explícitamente
  // Un BehaviorSubject nos permite notificar a toda la app (como al navbar) si el estado cambia
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    //private logoutTimer: any,// 💡 Guardará la referencia del temporizador
    //private router = inject(Router)
    private router: Router
  ) {}

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
      tap(response => {
        // 💡 SOLUCIÓN AQUÍ: Buscamos el token tanto en la raíz como dentro de response.data
        const accessToken = response?.access || response?.data?.access || response?.data?.access_token;
        const refreshToken = response?.refresh || response?.data?.refresh || response?.data?.refresh_token;
        const userData = response?.user || response?.data?.user;

        if (accessToken) {
          // Guardamos los datos de sesión de manera centralizada
          localStorage.setItem('access_token', accessToken);
          
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
          
          if (userData) {
            localStorage.setItem('user_data', JSON.stringify(userData));
          }

          // Notificamos inmediatamente a toda la app (como el Navbar) que el usuario se conectó
          this.loggedIn.next(true); 
          this.configurarAutoLogout();
          console.log('Tokens y datos de usuario almacenados en el AuthService con éxito.');
        } else {
          console.warn('Se recibió respuesta del servidor, pero no se encontró un "access_token" válido.', response);
        }
      })
    );
  }

  // Servicio de Registro (Envía los datos del nuevo cliente)
  register(userData: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData);
  }

// Cerrar Sesión de forma limpia
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    
    // 💡 Limpiamos el temporizador para evitar fugas de memoria
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    this.loggedIn.next(false); // Cambia el estado a desconectado (El Navbar se actualiza al tiro)
    this.router.navigate(['/login']);
  }

  // 💡 LÓGICA DE AUTO-LOGOUT
  private configurarAutoLogout() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      // Decodificamos la parte central (payload) del JWT usando funciones nativas
      const payloadBase64 = token.split('.')[1];
      const payloadDecodificado = JSON.parse(atob(payloadBase64));
      
      // 'exp' viene del backend en segundos, lo convertimos a milisegundos
      const tiempoExpiracion = payloadDecodificado.exp * 1000;
      const tiempoRestante = tiempoExpiracion - Date.now();

      // Si queda tiempo disponible, configuramos el reloj
      if (tiempoRestante > 0) {
        if (this.logoutTimer) clearTimeout(this.logoutTimer);

        this.logoutTimer = setTimeout(() => {
          console.warn('La sesión ha expirado por límite de tiempo (3 minutos).');
          this.logout();
        }, tiempoRestante);
      } else {
        // Si por alguna razón el token ya venció cuando abrió la app
        this.logout();
      }
    } catch (error) {
      console.error('Error al calcular la expiración del token:', error);
      this.logout(); // Si el token está corrupto, lo sacamos por seguridad
    }
  }
}