import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { DocenteData } from '../components/dashboard/dashboard.component';

export class AppDatabase extends Dexie {
  docentes!: Table<DocenteData, string>;

  constructor() {
    super('UnefaNominaDB');
    this.version(1).stores({
      docentes: 'cedula, apellidos, nombres, nucleo, condicion'
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db = new AppDatabase();

  async getAllDocentes(): Promise<DocenteData[]> {
    return await this.db.docentes.toArray();
  }

  async saveDocente(docente: DocenteData): Promise<string> {
    return await this.db.docentes.put(docente);
  }

  async bulkSaveDocentes(docentes: DocenteData[]): Promise<void> {
    await this.db.docentes.bulkPut(docentes);
  }

  async deleteDocente(cedula: string): Promise<void> {
    await this.db.docentes.delete(cedula);
  }

  async deleteMultipleDocentes(cedulas: string[]): Promise<void> {
    await this.db.docentes.bulkDelete(cedulas);
  }
}
