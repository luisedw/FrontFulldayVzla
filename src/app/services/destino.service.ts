// src/app/services/destino.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Destino,  } from '../models/destino.model';
import { ApiResponse } from '../models/ApiResponse';


// Interfaces para tipar las respuestas de tu API
export interface ApiResponse2<T> {
  estatus: string;
  data: T[];
}

export interface LookupItem {
  id: number;
  nombre: string;
  acronimo?: string;
}

export interface CiudadItem {
  id: number;
  nombre: string;
  pais: {
    id: number;
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DestinoService {
  // Pon aquí la URL exacta de tu backend de Django (el puerto que uses, ej: 8000)
  private apiUrl = 'http://127.0.0.1:8000/api/destinos-turisticos/'; 
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  // Petición HTTP GET para traer los destinos reales
  getDestinos(): Observable<ApiResponse<Destino[]>> {
    return this.http.get<ApiResponse<Destino[]>>(this.apiUrl);
  }

  // Obtener Países
  getPaises(): Observable<LookupItem[]> {
    return this.http.get<ApiResponse2<LookupItem>>(`${this.baseUrl}/paises/`).pipe(
      map(res => res.data)
    );
  }

  // Obtener Idiomas
  getIdiomas(): Observable<LookupItem[]> {
    return this.http.get<ApiResponse2<LookupItem>>(`${this.baseUrl}/idiomas/`).pipe(
      map(res => res.data)
    );
  }

  // Obtener Monedas
  getMonedas(): Observable<LookupItem[]> {
    return this.http.get<ApiResponse2<LookupItem>>(`${this.baseUrl}/monedas/`).pipe(
      map(res => res.data)
    );
  }

  // Nota: Como no especificaste el endpoint de ciudades, asumimos la convención REST de tu API
  getCiudades(): Observable<CiudadItem[]> {
    return this.http.get<ApiResponse2<CiudadItem>>(`${this.baseUrl}/ciudades/`).pipe(
      map(res => res.data)
    );
  }

  // Crear Destino usando FormData
  crearDestino(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/destinos-turisticos/`, formData);
  }
}