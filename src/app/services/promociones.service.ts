import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  private apiUrl = 'http://127.0.0.1:8000/api/paquetes-turisticos/';
  private tiposUrl = 'http://127.0.0.1:8000/api/tipos-paquetes/'; 

  constructor(private http: HttpClient) { }

  getPaquetes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // 🆕 Obtener tipos de paquetes reales de la base de datos
  getTiposPaquetes(): Observable<any> {
    return this.http.get<any>(this.tiposUrl);
  }

  // 🆕 Crear paquete turístico por POST
  crearPaquete(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}