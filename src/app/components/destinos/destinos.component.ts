import { Component, OnInit, Input } from '@angular/core';
import { Destino } from '../../models/destino.model';
import { DestinoService } from '../../services/destino.service';
import { ApiResponse } from '../../models/ApiResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-destinos',
  standalone: true,
  templateUrl: './destinos.component.html',
  styleUrl: './destinos.component.css'
})
export class DestinosComponent implements OnInit {
  // Angular inyectará automáticamente aquí el valor si el usuario usó el cintillo
  @Input() set buscar(value: string) {
    if (value) {
      this.filtrarDestinosPorTexto(value);
    }
  }

  listaDestinos: Destino[] = [];

  // Guardará el destino activo para el modal. Si es null, el modal estará oculto.
  destinoSeleccionado: Destino | null = null;

  constructor(
    private destinoService: DestinoService,
    private router: Router
  ) {}

  ngOnInit() {
    // Al cargar la vista, llamamos al backend (usando el interceptor que configuramos)
    this.destinoService.getDestinos().subscribe({
      next: (response: ApiResponse<Destino[]>) => {
        this.listaDestinos = response.data;
      },
      error: (err) => {
        console.error('Error al conectar con Django:', err);
        }
    });
  }

  // 💡 3. Crea la función para redirigir
  irAReservar(id: number) {
    // Si usas una variable booleana para cerrar tu modal, apágala aquí
    // Ej: this.mostrarModal = false; 
    
    // Navegamos a la ruta del tour detallado pasando el ID
    this.router.navigate(['/tour', id]);
  }

  // Métodos para controlar el ciclo de vida del modal
  abrirModal(destino: Destino) {
    this.destinoSeleccionado = destino;
  }
  cerrarModal() {
    this.destinoSeleccionado = null;
  }

  filtrarDestinosPorTexto(texto: string) {
    // Lógica para filtrar la lista basándote en la ciudad, país o nombre
  }
}