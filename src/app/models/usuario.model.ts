export interface UserAuth {
  id: number;
  username: string;
  email: string;
  roles: any[];
}

export interface ClientePerfil {
  id: number;
  user: { id: number };
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  telefono: string;
  cedula: string;
  creado_en: string;
  modificado_en: string;
}