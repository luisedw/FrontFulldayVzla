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
    this.filtrarDestinosPorTexto(value);
  }

  listaDestinos: Destino[] = [];
  destinosOriginales: Destino[] = []; // Copia maestra para búsquedas seguras

  // URL base de tu servidor de Django
  private readonly URL_BACKEND = 'http://127.0.0.1:8000';

  // Guardará el destino activo para el modal. Si es null, el modal estará oculto.
  destinoSeleccionado: Destino | null = null;

  constructor(
    private destinoService: DestinoService,
    private router: Router
  ) {}

  ngOnInit() {
    // Al cargar la vista, llamamos al backend
    this.destinoService.getDestinos().subscribe({
      next: (response: ApiResponse<Destino[]>) => {
        const backendData = response.data || response;

        // 💡 FILTRO: Dejamos pasar TODOS los destinos que tengan imagen válida
        const destinosValidos = backendData.filter((item: any) => 
          item.imagen_principal !== null && 
          item.imagen_principal !== undefined &&
          !item.imagen_principal.includes('placeholder')
        );

        // 💡 MAPEADO: Construimos el objeto inyectando la URL absoluta de Django
        this.destinosOriginales = destinosValidos.map((item: any) => ({
          ...item, // Conservamos todos los campos originales del backend (ciudad, pais, etc.)
          imagen_url: `${this.URL_BACKEND}${item.imagen_principal}` // Seteamos la URL correcta
        }));

        // Renderizamos toda la lista completa sin límites
        this.listaDestinos = [...this.destinosOriginales];
      },
      error: (err) => {
        console.error('Error al conectar con Django:', err);
      }
    });
  }

  irAReservar(id: number) {
    this.cerrarModal();
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

  // 💡 Lógica reactiva para el buscador del cintillo / input
  filtrarDestinosPorTexto(texto: string) {
    if (!texto || texto.trim() === '') {
      this.listaDestinos = [...this.destinosOriginales];
      return;
    }

    const busqueda = texto.toLowerCase().trim();

    // Filtramos dinámicamente buscando coincidencias en nombre, ciudad o descripción
    this.listaDestinos = this.destinosOriginales.filter(destino => 
      destino.nombre.toLowerCase().includes(busqueda) ||
      destino.ciudad?.nombre.toLowerCase().includes(busqueda) ||
      destino.descripcion?.toLowerCase().includes(busqueda)
    );
  }
}