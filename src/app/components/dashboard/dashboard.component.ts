import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DbService } from '../../services/db.service';
import * as XLSX from 'xlsx';

export interface DocenteData {
  num?: any;
  nucleo: string;
  extension: string;
  cedula: string;
  apellidos: string;
  nombres: string;
  fechaNacimiento: string;
  numHijos: string;
  numCuenta: string;
  correo: string;
  telefono: string;
  direccion: string;
  cargoColateral: string;
  fechaIngreso: string;
  condicion: string;
  dedicacion: string;
  categoria: string;
  programaDictado: string;
  componenteDocente: string;
  perfilDocente: string;
  asignaturas: string;
  pnitOncti: string;
  investigacion: string;
  observaciones: string;
  selected?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styles: [`
    :host { display: block; width: 100%; box-sizing: border-box; }
    .navbar {
      background-color: #003366; color: white; padding: 0.8rem 1.5rem;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 0.8rem; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .nav-title { margin: 0; font-size: 1.2rem; font-weight: bold; }
    .nav-controls { display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap; }
    .main-container { padding: 1.2rem; max-width: 1300px; margin: 0 auto; }
    .header-card {
      background: white; padding: 1.2rem 1.5rem; border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 1.5rem;
    }
    .action-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.2rem; margin-bottom: 2rem;
    }
    .action-card {
      background: white; border: 1px solid #e0e0e0; border-radius: 8px;
      padding: 1.2rem; text-align: center; box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .action-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
    .action-btn {
      width: 100%; padding: 0.65rem; margin-top: 0.8rem; border: none;
      border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 0.85rem;
    }
    .btn-migrar { background-color: #28a745; color: white; }
    .btn-agregar { background-color: #007bff; color: white; }
    .btn-descargar { background-color: #17a2b8; color: white; }
    .btn-borrar { background-color: #dc3545; color: white; }
    .table-container {
      background: white; padding: 1.2rem; border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow-x: auto;
    }
    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6); display: flex; justify-content: center;
      align-items: center; z-index: 1000; padding: 1rem;
    }
    .modal-content {
      background: white; padding: 1.5rem; border-radius: 8px; width: 100%;
      max-width: 1050px; max-height: 90vh; overflow-y: auto; box-sizing: border-box;
    }
    .grid-form {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.8rem;
    }
    .grid-form div { display: flex; flex-direction: column; }
    .grid-form label { font-size: 0.8rem; font-weight: bold; margin-bottom: 0.2rem; color: #333; }
    .grid-form input { padding: 0.45rem; border: 1px solid #ccc; border-radius: 4px; font-size: 0.85rem; }
    .table-cell-input {
      width: 100%; border: 1px solid transparent; background: transparent; padding: 0.2rem;
    }
    .table-cell-input:focus { border: 1px solid #007bff; background: white; outline: none; }
    @media (max-width: 768px) {
      .navbar { flex-direction: column; align-items: flex-start; }
      .nav-controls { width: 100%; justify-content: space-between; }
      .modal-content { padding: 1rem; }
      .grid-form { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  docentesList: DocenteData[] = [];
  selectAll: boolean = false;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  newDocente: DocenteData = this.getEmptyDocente();
  editingDocente: DocenteData = this.getEmptyDocente();
  originalCedulaEdit: string = '';

  constructor(
    private authService: AuthService,
    private dbService: DbService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const session = localStorage.getItem('unefa_active_user');
    if (session) {
      this.currentUser = JSON.parse(session);
      await this.loadDocentes();
    } else {
      this.router.navigate(['/login']);
    }
  }

  getEmptyDocente(): DocenteData {
    return {
      nucleo: 'CARABOBO', extension: 'GUACARA', cedula: '', apellidos: '', nombres: '',
      fechaNacimiento: '', numHijos: '0', numCuenta: '', correo: '', telefono: '',
      direccion: '', cargoColateral: 'NINGUNO', fechaIngreso: '', condicion: 'CONTRATADO',
      dedicacion: 'TIEMPO COMPLETO', categoria: 'INSTRUCTOR', programaDictado: 'INGENIERÍA DE SISTEMAS',
      componenteDocente: 'SI', perfilDocente: 'INGENIERO', asignaturas: '', pnitOncti: 'NO',
      investigacion: 'NO', observaciones: ''
    };
  }

  async loadDocentes(): Promise<void> {
    this.docentesList = await this.dbService.getAllDocentes();
  }

  logout(): void {
    this.authService.logout();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        let imported: DocenteData[] = [];

        rows.forEach((row) => {
          let ced = '';
          let apellidos = '';
          let nombres = '';
          let nucleo = '';
          let extension = '';
          let correo = '';
          let telefono = '';
          let condicion = '';
          let dedicacion = '';
          let categoria = '';
          let asignaturas = '';
          let fechaNac = '';
          let numHijos = '0';
          let numCuenta = '';
          let direccion = '';
          let cargoColateral = '';
          let fechaIngreso = '';
          let programaDictado = '';
          let componenteDocente = 'SI';
          let perfilDocente = '';
          let pnitOncti = 'NO';
          let investigacion = 'NO';
          let observaciones = '';

          if (row[3] && String(row[3]).match(/(\d{1,2}\.?\d{3}\.?\d{3}|\d{7,8})/)) {
            ced = String(row[3]).trim();
            nucleo = String(row[1] || 'CARABOBO').trim();
            extension = String(row[2] || 'GUACARA').trim();
            apellidos = String(row[4] || '').trim();
            nombres = String(row[5] || '').trim();
            fechaNac = String(row[6] || '').trim();
            numHijos = String(row[7] || '0').trim();
            numCuenta = String(row[8] || '').trim();
            correo = String(row[9] || '').trim();
            telefono = String(row[10] || '').trim();
            direccion = String(row[11] || '').trim();
            cargoColateral = String(row[12] || '').trim();
            fechaIngreso = String(row[13] || '').trim();
            condicion = String(row[14] || 'CONTRATADO').trim();
            dedicacion = String(row[15] || 'TIEMPO COMPLETO').trim();
            categoria = String(row[16] || 'INSTRUCTOR').trim();
            programaDictado = String(row[17] || '').trim();
            componenteDocente = String(row[18] || 'SI').trim();
            perfilDocente = String(row[19] || '').trim();
            asignaturas = String(row[20] || '').trim();
            pnitOncti = String(row[21] || 'NO').trim();
            investigacion = String(row[22] || 'NO').trim();
            observaciones = String(row[23] || '').trim();
          } else if (row[8] && String(row[8]).match(/(V-|E-)?\d{1,2}\.?\d{3}\.?\d{3}/i)) {
            ced = String(row[8]).trim();
            const fullName = String(row[7] || '').trim();
            if (fullName.includes(',')) {
              const parts = fullName.split(',');
              apellidos = parts[0].trim();
              nombres = parts[1].trim();
            } else {
              nombres = fullName;
            }
            nucleo = String(row[5] || 'CARABOBO').trim();
            extension = String(row[6] || 'GUACARA').trim();
            fechaNac = String(row[9] || '').trim();
            telefono = String(row[10] || '').trim();
            direccion = String(row[11] || '').trim();
            correo = String(row[12] || '').trim();
            perfilDocente = String(row[13] || '').trim();
            cargoColateral = String(row[15] || '').trim();
            fechaIngreso = String(row[19] || '').trim();
            categoria = String(row[21] || row[24] || 'INSTRUCTOR').trim();
            condicion = String(row[22] || 'CONTRATADO').trim();
            programaDictado = String(row[39] || '').trim();
            asignaturas = String(row[41] || '').trim();
            observaciones = String(row[61] || '').trim();
          }

          if (ced && !ced.toUpperCase().includes('CÉDULA') && !ced.toUpperCase().includes('RESUMEN')) {
            imported.push({
              num: imported.length + 1,
              nucleo, extension, cedula: ced, apellidos, nombres,
              fechaNacimiento: fechaNac, numHijos, numCuenta, correo,
              telefono, direccion, cargoColateral, fechaIngreso, condicion,
              dedicacion, categoria, programaDictado, componenteDocente,
              perfilDocente, asignaturas, pnitOncti, investigacion, observaciones
            });
          }
        });

        if (imported.length > 0) {
          await this.dbService.bulkSaveDocentes(imported);
          await this.loadDocentes();
          alert(`¡Migración exitosa! Se importaron ${imported.length} registros estructurados.`);
        } else {
          alert('No se detectaron registros válidos con Cédula.');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  openAddModal(): void {
    this.newDocente = this.getEmptyDocente();
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  async submitAddDocente(): Promise<void> {
    if (!this.newDocente.cedula || !this.newDocente.nombres || !this.newDocente.apellidos) {
      alert('La Cédula, Nombres y Apellidos son requeridos.');
      return;
    }
    await this.dbService.saveDocente({ ...this.newDocente });
    await this.loadDocentes();
    this.closeAddModal();
    alert('¡Docente guardado correctamente!');
  }

  openEditModal(docente: DocenteData): void {
    this.editingDocente = JSON.parse(JSON.stringify(docente));
    this.originalCedulaEdit = docente.cedula;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  async submitEditDocente(): Promise<void> {
    if (!this.editingDocente.cedula || !this.editingDocente.nombres || !this.editingDocente.apellidos) {
      alert('La Cédula, Nombres y Apellidos son obligatorios.');
      return;
    }
    if (this.originalCedulaEdit !== this.editingDocente.cedula) {
      await this.dbService.deleteDocente(this.originalCedulaEdit);
    }
    await this.dbService.saveDocente({ ...this.editingDocente });
    await this.loadDocentes();
    this.closeEditModal();
    alert('¡Registro de docente actualizado exitosamente!');
  }

  exportToExcel(): void {
    if (this.docentesList.length === 0) {
      alert('No hay registros disponibles para exportar.');
      return;
    }
    const exportData = this.docentesList.map((d, index) => ({
      'N°': index + 1,
      'NÚCLEO': d.nucleo,
      'EXTENSIÓN DEL NÚCLEO': d.extension,
      'CÉDULA': d.cedula,
      'APELLIDOS': d.apellidos,
      'NOMBRES': d.nombres,
      'FECHA DE NACIMIENTO': d.fechaNacimiento,
      'Nº DE HIJOS': d.numHijos,
      'NÚMERO DE CUENTA': d.numCuenta,
      'CORREO': d.correo,
      'Nº TELEFÓNICO': d.telefono,
      'DIRECCIÓN ACTUAL': d.direccion,
      'CARGO COLATERAL': d.cargoColateral,
      'FECHA DE INGRESO': d.fechaIngreso,
      'CONDICIÓN': d.condicion,
      'DEDICACIÓN': d.dedicacion,
      'CATEGORIA': d.categoria,
      'PROGRAMA DICTADO': d.programaDictado,
      'COMPONENTE DOCENTE': d.componenteDocente,
      'PERFIL DEL DOCENTE': d.perfilDocente,
      'ASIGNATURAS': d.asignaturas,
      'PNIT/ONCTI': d.pnitOncti,
      'INVESTIGACIÓN': d.investigacion,
      'OBSERVACIONES': d.observaciones
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SABANA_DOCENTE');
    XLSX.writeFile(workbook, 'UNEFA_SABANA_DOCENTE_EDITABLE.xls');
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  async closeDeleteModal(): Promise<void> {
    this.showDeleteModal = false;
    await this.loadDocentes();
  }

  toggleSelectAll(): void {
    this.docentesList.forEach(d => d.selected = this.selectAll);
  }

  async deleteSingleDocente(cedula: string): Promise<void> {
    if (confirm(`¿Está seguro de eliminar al docente con Cédula ${cedula}?`)) {
      await this.dbService.deleteDocente(cedula);
      await this.loadDocentes();
    }
  }

  async deleteSelectedDocentes(): Promise<void> {
    const selected = this.docentesList.filter(d => d.selected).map(d => d.cedula);
    if (selected.length === 0) {
      alert('Por favor seleccione al menos un registro.');
      return;
    }
    if (confirm(`¿Desea eliminar los ${selected.length} docentes seleccionados?`)) {
      await this.dbService.deleteMultipleDocentes(selected);
      this.selectAll = false;
      await this.loadDocentes();
    }
  }

  async onCellEdit(docente: DocenteData): Promise<void> {
    await this.dbService.saveDocente(docente);
  }
}
