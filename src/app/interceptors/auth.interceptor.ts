import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Buscamos el access_token que guardamos en el login
  const token = localStorage.getItem('access_token');

  // 2. Si el token existe, clonamos la petición y le inyectamos el Bearer token
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Pasamos la petición clonada con el token
    return next(clonedRequest);
  }

  // 3. Si no hay token (como en el Login o Registro), la petición sigue su curso normal
  return next(req);
};