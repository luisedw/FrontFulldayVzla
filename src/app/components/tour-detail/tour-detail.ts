import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TourService } from '../../services/tour';
import { ReservaService, ReservaPayload } from '../../services/reserva.service';
import { Tour } from '../../models/tour.model';
import { CommonModule } from '@angular/common';

declare var Swal: any;

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.css'
})
export class TourDetail implements OnInit {
  tour?: Tour;

  constructor(
    private route: ActivatedRoute, 
    private tourService: TourService,
    private reservaService: ReservaService 
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tourService.getTourByIdRemote(id).subscribe({
      next: (response: any) => {
        const item = response.data || response;
        this.tour = {
          id: item.id,
          titulo: item.nombre,
          descripcion: item.descripcion || 'Explora este increíble destino turístico con todo incluido.',
          destino: item.ciudad?.nombre || 'Venezuela',
          precio: item.precio || 45,
          imagenUrl: item.imagenUrl || 'assets/img/CayoSombrero.jpg',
          puntuacion: item.puntuacion || 4.8,
          servicios: item.servicios || ['bus', 'food', 'water', 'guide'],
          galeria: item.galeria || []
        };
      }
    });
  }

  confirmarReserva(fecha: string, personas: string) {
    if (!fecha) {
      Swal.fire({
        icon: 'warning',
        title: '¡Ups!',
        text: 'Por favor selecciona una fecha para tu viaje.',
        confirmButtonColor: '#0dcaf0'
      });
      return;
    }

    const total = (this.tour?.precio || 0) * Number(personas);

    // 💳 PASO 1: Pasarela de Pago Móvil en SweetAlert
    Swal.fire({
      title: 'Método de Pago: Pago Móvil',
      html: `
        <div class="text-start p-1" style="font-size: 0.95rem;">
          <p class="mb-3 alert alert-info text-center" style="font-size: 0.85rem;">
            Realiza el pago móvil y registra el número de referencia para procesar la reserva.
          </p>
          
          <div class="card p-3 bg-light border-0 mb-3" style="border-radius: 10px;">
            <p class="mb-1"><b>Banco:</b> Banco del Tesoro</p>
            <p class="mb-1"><b>Teléfono:</b> 04269183062</p>
            <p class="mb-1"><b>Cédula:</b> V26283133</p>
            <hr class="my-2">
            <p class="mb-0 text-center fs-5 text-dark"><b>Monto Total: $${total}</b></p>
          </div>

          <div class="mb-2">
            <label for="pago-referencia" class="form-label"><b>Número de Referencia:</b></label>
            <input text="text" id="pago-referencia" class="form-control" 
                   placeholder="Ej. 123456" 
                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar Pago y Reservar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0dcaf0',
      cancelButtonColor: '#6c757d',
      focusConfirm: false,
      preConfirm: () => {
        const referencia = (document.getElementById('pago-referencia') as HTMLInputElement).value.trim();
        if (!referencia) {
          Swal.showValidationMessage('Por favor, ingresa el número de referencia de la transacción');
        }
        return referencia;
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        const numReferencia = result.value;

        // 🚀 PASO 2: Construcción del Payload
 const payload: ReservaPayload = {
  pago_id: numReferencia, 
  paquete_id: this.tour?.id || 1, 
  cedula: "V26283133", 
  cantidad_personas: Number(personas),
  estatus_id: 1,
  fecha: fecha // 💡 O la mandas directamente aquí
};

        Swal.fire({
          title: 'Registrando reserva...',
          text: 'Estamos validando tus datos en el servidor.',
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // 📡 PASO 3: Consumo del servicio (¡Con el objeto de callbacks corregido!)
        this.reservaService.crearReserva(payload).subscribe({
          next: (response) => {
            if (response.estatus === "success") {
              Swal.fire({
                title: '¡Reserva Completada!',
                html: `
                  <div class="text-start mt-2">
                    <p>Anotamos tu pago móvil con la referencia <b>#${numReferencia}</b>.</p>
                    <p><b>Destino:</b> ${this.tour?.titulo}</p>
                    <p><b>Fecha elegida:</b> ${fecha}</p>
                    <p><b>Cupos reservados:</b> ${personas}</p>
                  </div>
                `,
                icon: 'success',
                confirmButtonColor: '#0dcaf0'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error al procesar',
                text: response.mensaje || 'No se pudo registrar la reserva.',
                confirmButtonColor: '#d33'
              });
            }
          },
          error: (err) => {
            console.error('Error en endpoint /api/reservas/:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error de validación',
              text: err.error?.mensaje || 'El cliente con la cédula ingresada no existe en la base de datos.',
              confirmButtonColor: '#d33'
            });
          }
        }); // <-- Aquí cierra correctamente el subscribe sin mezclar métodos
      }
    });
  } // <-- Aquí termina el método confirmarReserva

  // 💡 LUGAR CORRECTO: El método ahora vive al nivel de la clase TourDetail
  getServicioIcon(servicio: string): string {
    const iconos: { [key: string]: string } = {
      'bus': 'bi-bus-front', 
      'car': 'bi-car-front', 
      'food': 'bi-egg-fried',
      'water': 'bi-droplet-fill', 
      'guide': 'bi-person-badge', 
      'boat': 'bi-water'
    };
    return iconos[servicio.toLowerCase()] || 'bi-star';
  }
}