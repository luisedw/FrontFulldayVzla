import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 💡 Modificamos el contrato para reflejar tu JSON real
export interface ReservaPayload {
  pago_id: string;
  paquete_id: number;
  cliente_id: number; // 👈 ¡Ahora es el ID del usuario!
  cantidad_personas: number;
  estatus_id: number;
  fecha: string; 
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://127.0.0.1:8000/api/reservas/';

  constructor(private http: HttpClient) { }

  crearReserva(payload: ReservaPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}