import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('access_token');

  // Clonamos la petición para inyectar el Token si existe
  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Procesamos la petición y vigilamos si ocurre un error de autenticación
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 💡 Si el código es 401, el backend rechazó el token por viejo o inválido
      if (error.status === 401) {
        console.error('Petición rechazada (401 Unauthorized). Forzando cierre de sesión...');
        authService.logout(); 
      }
      return throwError(() => error);
    })
  );
};