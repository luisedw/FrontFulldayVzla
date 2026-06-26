import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DestinoService,  LookupItem, CiudadItem } from '../../services/destino.service';

@Component({
  selector: 'app-gestionar-destinos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestionar-destinos.component.html',
  styleUrl: './gestionar-destinos.component.css'
})
export class GestionarDestinosComponent implements OnInit {
  destinoForm!: FormGroup;
  
  paises: LookupItem[] = [];
  ciudades: CiudadItem[] = [];          // Base de datos completa de ciudades
  ciudadesFiltradas: CiudadItem[] = []; // Ciudades que se mostrarán en el select
  idiomas: LookupItem[] = [];
  monedas: LookupItem[] = [];

  // Propiedades para la carga de archivos
  selectedFile: File | null = null;
  imagenPreview: string | null = null;

  enviando: boolean = false;
  mensajeAlerta: string | null = null;
  tipoAlerta: 'success' | 'danger' = 'success';

  constructor(private fb: FormBuilder, private destinoService: DestinoService) {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarListasDesplegables();
    this.escucharCambioPais();
  }

  private initForm(): void {
    this.destinoForm = this.fb.group({
      nombre_destino_turistico: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]], // 🆕 Campo agregado
      pais_id: ['', Validators.required],
      ciudad_id: [{ value: '', disabled: true }, Validators.required], // Deshabilitado hasta elegir país
      idioma_id: ['', Validators.required],
      moneda_id: ['', Validators.required]
    });
  }

  // ⚡ LÓGICA CRUCIAL: Escucha cuándo cambia el país para filtrar las ciudades
  private escucharCambioPais(): void {
    this.destinoForm.get('pais_id')?.valueChanges.subscribe((paisId) => {
      const ciudadControl = this.destinoForm.get('ciudad_id');
      
      ciudadControl?.setValue(''); // Limpiamos la ciudad seleccionada previamente
      
      if (paisId) {
        // Filtramos buscando coincidencias con el ID del país anidado de tu JSON
        this.ciudadesFiltradas = this.ciudades.filter(c => c.pais.id === Number(paisId));
        ciudadControl?.enable(); // Habilitamos el select de ciudades
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
    
    this.destinoService.getCiudades().subscribe({ 
      next: (data) => {
        this.ciudades = data;
      } 
    });
  }

  // 🆕 Captura de archivo de imagen y generación de preview
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // 🆕 Quitar imagen cargada
  removeImage(): void {
    this.selectedFile = null;
    this.imagenPreview = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit(): void {
    if (this.destinoForm.invalid) {
      this.destinoForm.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.mensajeAlerta = null;

    // Empaquetamos todo en el FormData
    const formData = new FormData();
    formData.append('nombre_destino_turistico', this.destinoForm.get('nombre_destino_turistico')?.value);
    formData.append('descripcion', this.destinoForm.get('descripcion')?.value);
    formData.append('pais_id', this.destinoForm.get('pais_id')?.value);
    formData.append('ciudad_id', this.destinoForm.get('ciudad_id')?.value);
    formData.append('idioma_id', this.destinoForm.get('idioma_id')?.value);
    formData.append('moneda_id', this.destinoForm.get('moneda_id')?.value);
    
    // Adjuntamos el archivo físico si el usuario seleccionó uno
    if (this.selectedFile) {
      formData.append('imagen_principal', this.selectedFile, this.selectedFile.name);
    }

    this.destinoService.crearDestino(formData).subscribe({
      next: () => {
        this.enviando = false;
        this.tipoAlerta = 'success';
        this.mensajeAlerta = '¡Destino turístico creado exitosamente!';
        this.destinoForm.reset();
        this.removeImage();
      },
      error: (error) => {
        this.enviando = false;
        this.tipoAlerta = 'danger';
        this.mensajeAlerta = 'Hubo un error al registrar el destino.';
        console.error(error);
      }
    });
  }
}