import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DestinoService, LookupItem, CiudadItem } from '../../services/destino.service';
import { PromocionesService } from '../../services/promociones.service';

@Component({
  selector: 'app-gestionar-destinos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestionar-destinos.component.html',
  styleUrl: './gestionar-destinos.component.css'
})
export class GestionarDestinosComponent implements OnInit {
  // Control del Asistente de Pasos
  pasoActual: number = 1; 

  // Formularios Independientes
  destinoForm!: FormGroup;
  paqueteForm!: FormGroup;
  
  // Listas Desplegables Paso 1 (Destinos)
  paises: LookupItem[] = [];
  ciudades: CiudadItem[] = [];         
  ciudadesFiltradas: CiudadItem[] = []; 
  idiomas: LookupItem[] = [];
  monedas: LookupItem[] = [];

  // Listas Desplegables Paso 2 (Paquetes)
  tiposPaquete: any[] = [];
  nombreDestinoCreado: string = ''; // Para mostrar feedback visual en el paso 2

  // Propiedades para la carga de imágenes
  selectedFile: File | null = null;
  imagenPreview: string | null = null;

  // Estados globales de carga
  enviando: boolean = false;
  mensajeAlerta: string | null = null;
  tipoAlerta: 'success' | 'danger' = 'success';

  constructor(
    private fb: FormBuilder, 
    private destinoService: DestinoService,
    private promocionesService: PromocionesService
  ) {
    this.initFormDestino();
    this.initFormPaquete();
  }

  ngOnInit(): void {
    this.cargarListasDesplegables();
    this.escucharCambioPais();
  }

  private initFormDestino(): void {
    this.destinoForm = this.fb.group({
      nombre_destino_turistico: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      pais_id: ['', Validators.required],
      ciudad_id: [{ value: '', disabled: true }, Validators.required], 
      idioma_id: ['', Validators.required],
      moneda_id: ['', Validators.required]
    });
  }

  private initFormPaquete(): void {
    this.paqueteForm = this.fb.group({
      nombre_paquete_turistico: ['', [Validators.required, Validators.minLength(3)]],
      destino_id: ['', Validators.required], // Se llenará y bloqueará automáticamente
      tipo_paquete_id: ['', Validators.required],
      duracion_dias: ['', [Validators.required, Validators.min(1)]],
      precio_base_bs: ['', [Validators.required, Validators.min(0.01)]],
      capacidad_maxima_integrantes: ['', [Validators.required, Validators.min(1)]],
      fecha_inicio_raw: ['', Validators.required], 
      fecha_fin_raw: ['', Validators.required]     
    });
  }

  private escucharCambioPais(): void {
    this.destinoForm.get('pais_id')?.valueChanges.subscribe((paisId) => {
      const ciudadControl = this.destinoForm.get('ciudad_id');
      ciudadControl?.setValue(''); 
      if (paisId) {
        this.ciudadesFiltradas = this.ciudades.filter(c => c.pais.id === Number(paisId));
        ciudadControl?.enable(); 
      } else {
        this.ciudadesFiltradas = [];
        ciudadControl?.disable();
      }
    });
  }

  private cargarListasDesplegables(): void {
    this.destinoService.getPaises().subscribe({ next: (data) => this.paises = data });
    this.destinoService.getIdiomas().subscribe({ next: (data) => this.idiomas = data });
    this.destinoService.getMonedas().subscribe({ next: (data) => this.monedas = data });
    this.destinoService.getCiudades().subscribe({ next: (data) => this.ciudades = data });
    
    // 💡 Cargamos los tipos de paquetes reales del backend de Django
    this.promocionesService.getTiposPaquetes().subscribe({
      next: (response) => {
        this.tiposPaquete = response.data || response;
      },
      error: (err) => console.error('Error cargando tipos de paquetes:', err)
    });
  }

  // Captura y preview de imagen
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagenPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagenPreview = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  formatearFecha(fechaInput: string): string {
    if (!fechaInput) return '';
    const [year, month, day] = fechaInput.split('-');
    return `${day}/${month}/${year}`;
  }

  // ================= SUBMITS DEL ASISTENTE =================

  onSubmitDestino(): void {
    if (this.destinoForm.invalid) {
      this.destinoForm.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.mensajeAlerta = null;

    const formData = new FormData();
    formData.append('nombre_destino_turistico', this.destinoForm.get('nombre_destino_turistico')?.value);
    formData.append('descripcion', this.destinoForm.get('descripcion')?.value);
    formData.append('pais_id', this.destinoForm.get('pais_id')?.value);
    formData.append('ciudad_id', this.destinoForm.get('ciudad_id')?.value);
    formData.append('idioma_id', this.destinoForm.get('idioma_id')?.value);
    formData.append('moneda_id', this.destinoForm.get('moneda_id')?.value);
    
    if (this.selectedFile) {
      formData.append('imagen_principal', this.selectedFile, this.selectedFile.name);
    }

    this.destinoService.crearDestino(formData).subscribe({
      next: (response: any) => {
        this.enviando = false;
        
        // Extraemos los datos del destino recién creado
        const destinoId = response.data?.id || response.id;
        this.nombreDestinoCreado = this.destinoForm.get('nombre_destino_turistico')?.value;

        // 💡 LÓGICA CLUCIAL: Inyectamos el ID del destino directo en el paso 2 y lo bloqueamos
        this.paqueteForm.patchValue({ destino_id: destinoId });

        // Limpiamos el formulario 1 y avanzamos de paso
        this.destinoForm.reset();
        this.removeImage();
        
        this.pasoActual = 2; // Avanza a la pantalla de paquetes
        this.tipoAlerta = 'success';
        this.mensajeAlerta = `¡Destino "${this.nombreDestinoCreado}" guardado! Ahora completa el paquete turístico.`;
      },
      error: (error) => {
        this.enviando = false;
        this.tipoAlerta = 'danger';
        this.mensajeAlerta = 'Hubo un error al registrar el destino.';
        console.error(error);
      }
    });
  }

  onSubmitPaquete(): void {
    if (this.paqueteForm.invalid) {
      this.paqueteForm.markAllAsTouched();
      return;
    }

    this.enviando = true;
    const formValues = this.paqueteForm.value;

    const payload = {
      nombre_paquete_turistico: formValues.nombre_paquete_turistico,
      destino_id: Number(formValues.destino_id),
      tipo_paquete_id: Number(formValues.tipo_paquete_id),
      duracion_dias: Number(formValues.duracion_dias),
      precio_base_bs: Number(formValues.precio_base_bs),
      capacidad_maxima_integrantes: Number(formValues.capacidad_maxima_integrantes),
      fecha_inico: this.formatearFecha(formValues.fecha_inicio_raw), // Mantiene tu propiedad de Django
      fecha_fin: this.formatearFecha(formValues.fecha_fin_raw)       
    };

    this.promocionesService.crearPaquete(payload).subscribe({
      next: (response: any) => {
        this.enviando = false;
        this.paqueteForm.reset();
        this.pasoActual = 1; // Reseteamos al paso inicial para nuevas creaciones
        this.tipoAlerta = 'success';
        this.mensajeAlerta = '¡Paquete turístico y promoción publicados exitosamente!';
      },
      error: (err) => {
        this.enviando = false;
        this.tipoAlerta = 'danger';
        this.mensajeAlerta = 'Error al guardar el paquete turístico.';
        console.error(err);
      }
    });
  }

  regresarAlPasoUno(): void {
    this.pasoActual = 1;
    this.mensajeAlerta = null;
  }
}