// src/app/services/destino.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destino,  } from '../models/destino.model';
import { ApiResponse } from '../models/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class DestinoService {
  // Pon aquí la URL exacta de tu backend de Django (el puerto que uses, ej: 8000)
  private apiUrl = 'http://127.0.0.1:8000/api/destinos-turisticos/'; 

  constructor(private http: HttpClient) { }

  // Petición HTTP GET para traer los destinos reales
  getDestinos(): Observable<ApiResponse<Destino[]>> {
    return this.http.get<ApiResponse<Destino[]>>(this.apiUrl);
  }
}