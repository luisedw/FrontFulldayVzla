export interface Tour {
  id: number;
  destino: string;
  titulo: string;
  precio: number;
  descripcion: string;
  imagenUrl: string;
  puntuacion: number;
  servicios: string[]; // ['bus', 'food', 'water', 'guide']
}