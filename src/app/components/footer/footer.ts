import { Component } from '@angular/core';

// 1. La interfaz DEBE ir aquí arriba, totalmente afuera
interface MiembroEquipo {
  nombre: string;
  rol: string;
  foto: string;
  qr: string; // Cambiado a 'qr' para que coincida exactamente con tu HTML
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {

  // 2. Arreglo del equipo (Cambiado a 'integrantes' para que coincida con tu @for del HTML)
  integrantes: MiembroEquipo[] = [
    { nombre: 'Cristian Castro', rol: 'Administrador de Base de Datos', foto: 'assets/integrantes/Cristian.jpeg', qr: 'assets/qr/integrante1.jpeg' },
    { nombre: 'Luis Maita', rol: 'Desarrollador Frontend', foto: 'assets/integrantes/Luis.jpeg', qr: 'assets/qr/integrante2.jpeg' },
    { nombre: 'Yorfan Villegas', rol: 'Scrum Master', foto: 'assets/integrantes/Yorfan.jpeg', qr: 'assets/qr/integrante3.jpeg' },
    { nombre: 'Yorwin Camacho', rol: 'Desarrollador Backend', foto: 'assets/integrantes/Yorwin.jpeg', qr: 'assets/qr/integrante1.jpeg' }
  ];

  // 3. El docente (Cambiado a 'profesor' para que coincida con tu HTML)
  profesor: MiembroEquipo = {
    nombre: 'Prof. Walter Ca...',
    rol: 'Docente / Evaluador',
    foto: 'assets/integrantes/WalterTiger.jpg',
    qr: 'assets/qrs/walter-qr.png'
  };

  // 4. Variable de estado para el modal
  miembroSeleccionado: MiembroEquipo | null = null;

  // 5. Métodos para controlar el modal
  abrirQr(miembro: MiembroEquipo) {
    this.miembroSeleccionado = miembro;
  }

  cerrarQr() {
    this.miembroSeleccionado = null;
  }
}