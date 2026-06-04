// src/app/models/destino.model.ts

export interface UbicacionBase {
  id: number;
  nombre: string;
  estatus: string;
}

export interface Destino {
  id: number;
  nombre: string;
  descripcion: string;
  pais: UbicacionBase;
  ciudad: UbicacionBase;
  idioma_principal: UbicacionBase;
  moneda_local: {
    id: number;
    nombre: string;
    acronimo: string;
    estatus: string;
  };
  estatus: string;
  // Agrega aquí campos de imagen o precio si los integras luego
  imagen_url?: string; 
}