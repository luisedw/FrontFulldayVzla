import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  private apiUrl = 'http://127.0.0.1:8000/api/paquetes-turisticos/';

  constructor(private http: HttpClient) { }

  // Obtiene todos los paquetes turísticos de la API
  getPaquetes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}