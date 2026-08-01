export interface Docente {
  id?: string;
  cedula: string;
  apellidos: string;
  nombres: string;
  correo: string;
  telefono: string;
  nucleo: string;
  extension: string;
  categoria?: string;
  dedicacion?: string;
  estatus?: string;
}

export interface User {
  id?: string;
  cedula: string;
  nombre: string;
  apellido: string;
  direccion: string;
  correo: string;
  telefono: string;
  passwordHash: string;
  role: 'ADMIN' | 'USER';
}
