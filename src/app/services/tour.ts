import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  // 💡 IMPORTANTE: Deja la URL sin barra '/' al final para evitar la doble barra
  private apiUrl = 'http://127.0.0.1:8000/api/destinos-turisticos'; 

  constructor(private http: HttpClient) { }

  getToursRemote(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getTourByIdRemote(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}