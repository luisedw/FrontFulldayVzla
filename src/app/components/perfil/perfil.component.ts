import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ClientePerfil } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  isEditing: boolean = false;
  loading: boolean = true;
  usernameLogueado: string = '';
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.initForm();
  }

  ngOnInit(): void {
const userData = this.authService.currentPayloadValue; 
  
  if (userData) {
    this.userId = userData.id;
    this.usernameLogueado = userData.username; // Aquí capturará "luis"
    this.cargarDatosPerfil();
  } else {
    // Por seguridad, si no hay sesión iniciada, lo mandamos al login
    this.authService.logout();
  }
}
  private initForm(): void {
    this.perfilForm = this.fb.group({
      primer_nombre: [{ value: '', disabled: true }, [Validators.required]],
      segundo_nombre: [{ value: '', disabled: true }],
      primer_apellido: [{ value: '', disabled: true }, [Validators.required]],
      segundo_apellido: [{ value: '', disabled: true }],
      cedula: [{ value: '', disabled: true }, [Validators.required]],
      telefono: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  cargarDatosPerfil(): void {
    // Reemplaza esta URL por el endpoint exacto de tu servicio de perfiles
    const url = `http://127.0.0.1:8000/api/clientes/${this.userId}/`; 
    
    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.estatus === 'success') {
          // Rellenamos el formulario reactivo con la data de Django
          this.perfilForm.patchValue(response.data);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al traer el perfil:', err);
        this.loading = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.perfilForm.enable(); // Habilita los inputs para edición
    } else {
      this.perfilForm.disable(); // Vuelve a bloquearlos si cancela
      this.cargarDatosPerfil(); // Resetea los valores originales
    }
  }

  guardarCambios(): void {
    if (this.perfilForm.invalid) return;

    this.loading = true;
    const url = `http://127.0.0.1:8000/api/clientes/${this.userId}/`;
    const payload = this.perfilForm.value;

    // Enviamos la actualización mediante PUT o PATCH según tu backend
    this.http.put<any>(url, payload).subscribe({
      next: (response) => {
        if (response.estatus === 'success') {
          this.isEditing = false;
          this.perfilForm.disable(); // Bloqueamos inputs de nuevo
          alert('¡Perfil actualizado correctamente!');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.loading = false;
        alert('Hubo un error al intentar guardar los cambios.');
      }
    });
  }
}