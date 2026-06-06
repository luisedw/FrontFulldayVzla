import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; // 💡 Importamos BehaviorSubject

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private apiUrl = 'http://127.0.0.1:8000/api/destinos-turisticos'; 

  // 💡 Canal invisible para transmitir el texto de búsqueda
  private filtroSearch$ = new BehaviorSubject<string>('');
  textoBuscado$ = this.filtroSearch$.asObservable();

  constructor(private http: HttpClient) { }

  getToursRemote(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getTourByIdRemote(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 💡 Método para que el Hero mande la palabra escrita
  setFiltro(texto: string) {
    this.filtroSearch$.next(texto);
  }
}