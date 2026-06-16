export interface DestinoPaquete {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface TipoPaquete {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Paquete {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_principal: string;
  destino: DestinoPaquete;
  tipo_paquete: TipoPaquete;
  duracion_dias: number;
  precio_base_bs: number;
  capacidad_maxima_integrantes: number;
  fecha_inico: string; // Nota: viene como fecha_inico en tu JSON
  fecha_fin: string;
  disponible: string;
  estatus: string;
}