import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-paquete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-paquete.component.html',
  styleUrl: './crear-paquete.component.css'
})
export class CrearPaqueteComponent implements OnInit {
  paqueteForm!: FormGroup;
  enviando: boolean = false;

  // Listas de simulación para los Selects (Luego vendrán de sus microservicios)
  destinos = [
    { id: 1, nombre: 'Caracas (El Ávila)' },
    { id: 2, nombre: 'Morrocoy' },
    { id: 3, nombre: 'Cartagena' }
  ];

  tiposPaquete = [
    { id: 1, nombre: 'Familiar' },
    { id: 2, nombre: 'Luna de Miel' },
    { id: 3, nombre: 'Aventura / Excursión' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.paqueteForm = this.fb.group({
      nombre_paquete_turistico: ['', [Validators.required, Validators.minLength(3)]],
      destino_id: ['', Validators.required],
      tipo_paquete_id: ['', Validators.required],
      duracion_dias: ['', [Validators.required, Validators.min(1)]],
      precio_base_bs: ['', [Validators.required, Validators.min(0.01)]],
      capacidad_maxima_integrantes: ['', [Validators.required, Validators.min(1)]],
      fecha_inicio_raw: ['', Validators.required], // Captura del input date nativo
      fecha_fin_raw: ['', Validators.required]     // Captura del input date nativo
    });
  }

  // 🛠️ Función para transformar '2026-05-02' en '02/05/2026'
  formatearFecha(fechaInput: string): string {
    if (!fechaInput) return '';
    const [year, month, day] = fechaInput.split('-');
    return `${day}/${month}/${year}`;
  }

  guardarPaquete(): void {
    if (this.paqueteForm.invalid) {
      this.paqueteForm.markAllAsTouched();
      return;
    }

    this.enviando = true;
    const formValues = this.paqueteForm.value;

    // 🚀 Construimos exactamente el JSON estructurado que pide tu backend
    const payloadPayload = {
      nombre_paquete_turistico: formValues.nombre_paquete_turistico,
      destino_id: Number(formValues.destino_id),
      tipo_paquete_id: Number(formValues.tipo_paquete_id),
      duracion_dias: Number(formValues.duracion_dias),
      precio_base_bs: Number(formValues.precio_base_bs),
      capacidad_maxima_integrantes: Number(formValues.capacidad_maxima_integrantes),
      fecha_inico: this.formatearFecha(formValues.fecha_inicio_raw), // Formateada a DD/MM/AAAA
      fecha_fin: this.formatearFecha(formValues.fecha_fin_raw)       // Formateada a DD/MM/AAAA
    };

    console.log('Enviando Payload:', payloadPayload);

    const url = 'http://127.0.0.1:8000/api/paquetes-turisticos/'; // Reemplaza por tu URL real
    
    this.http.post(url, payloadPayload).subscribe({
      next: (response: any) => {
        this.enviando = false;
        if (response.estatus === 'success') {
          alert(`¡Éxito! ${response.mensaje}. ID asignado: ${response.data.id}`);
          this.paqueteForm.reset();
        }
      },
      error: (err) => {
        this.enviando = false;
        console.error('Error de backend', err);
        alert('Hubo un error al comunicar con el Microservicio.');
      }
    });
  }
}