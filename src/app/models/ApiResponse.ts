// src/app/models/api-response.model.ts

export interface ApiResponse<T> {
  estatus: string;              // "success", "error", etc.
  codigo: string | number | null; // Códigos de error personalizados del sistema
  mensaje: string | null;        // Mensaje amigable para el usuario
  mensaje_tecnico: string | null;// Mensaje detallado para depuración en consola
  data: T;                      // Aquí entra el tipo genérico (Destino[], Tour[], Usuario, etc.)
  paginacion: Paginacion | null;// Estructura para tablas o listas paginadas
  errores: any[];               // Lista de errores detallados si aplica
  metadata: any;                // Datos adicionales del servidor
  timestamp: number;            // Marca de tiempo Unix de la respuesta
}

// Opcional: Si tu backend llega a enviar datos de paginación estructurados en el futuro
export interface Paginacion {
  pagina_actual: number;
  total_paginas: number;
  tamano_pagina: number;
  total_elementos: number;
}