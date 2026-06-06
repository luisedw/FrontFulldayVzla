import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservaPayload {
  pago_id: string;
  paquete_id: number;
  cedula: string;
  cantidad_personas: number;
  estatus_id: number;
  fecha: string; // Lo dejamos opcional para cuando tu compañero lo active
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
