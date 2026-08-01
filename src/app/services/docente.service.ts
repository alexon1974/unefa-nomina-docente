import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Docente {
  cedula: string;
  nombres: string;
  apellidos: string;
  nucleo?: string;
  extension?: string;
  fechaNacimiento?: string;
  numHijos?: string;
  numCuenta?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  cargoColateral?: string;
  fechaIngreso?: string;
  condicion?: string;
  dedicacion?: string;
  categoria?: string;
  programaDictado?: string;
  componenteDocente?: string;
  perfilDocente?: string;
  asignaturas?: string;
  pnitOncti?: string;
  investigacion?: string;
  observaciones?: string;
  selected?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DocentesService {
  private readonly STORAGE_KEY = 'unefa_docentes_db';
  private docentesSubject = new BehaviorSubject<Docente[]>([]);
  public docentes$: Observable<Docente[]> = this.docentesSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  // Load persistent data from LocalStorage
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        this.docentesSubject.next(JSON.parse(data));
      } else {
        this.docentesSubject.next([]);
      }
    } catch (e) {
      console.error('Error loading data from LocalStorage', e);
      this.docentesSubject.next([]);
    }
  }

  // Save changes to LocalStorage immediately
  private saveToStorage(docentes: Docente[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(docentes));
      this.docentesSubject.next(docentes);
    } catch (e) {
      console.error('Error saving data to LocalStorage', e);
    }
  }

  public getDocentes(): Docente[] {
    return this.docentesSubject.value;
  }

  public addDocente(docente: Docente): void {
    const current = this.getDocentes();
    const updated = [...current, docente];
    this.saveToStorage(updated);
  }

  public updateDocente(docente: Docente): void {
    const current = this.getDocentes();
    const index = current.findIndex(d => d.cedula === docente.cedula);
    if (index !== -1) {
      current[index] = { ...docente };
      this.saveToStorage([...current]);
    }
  }

  public deleteDocente(cedula: string): void {
    const current = this.getDocentes();
    const updated = current.filter(d => d.cedula !== cedula);
    this.saveToStorage(updated);
  }

  public deleteMultiple(cedulas: string[]): void {
    const current = this.getDocentes();
    const updated = current.filter(d => !cedulas.includes(d.cedula));
    this.saveToStorage(updated);
  }

  public bulkImport(docentes: Docente[]): void {
    this.saveToStorage(docentes);
  }
}
