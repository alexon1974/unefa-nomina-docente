import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// We add this interface back so db.service.ts compiles successfully!
export interface DocenteData {
  id?: string | number;
  cedula?: string;
  nombre?: string;
  [key: string]: any; // This allows any other properties your db.service might be using
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="min-height: 100vh; background-color: #f4f6f9; padding: 30px; font-family: Arial, sans-serif;">
      <div style="max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #003366; padding-bottom: 15px; margin-bottom: 20px;">
          <div>
            <h1 style="color: #003366; margin: 0; font-size: 24px;">UNEFA - Sistema de Nómina Docente</h1>
            <p style="color: #555; margin: 5px 0 0 0; font-size: 14px;">Área de Ingeniería | Coordinación Académica</p>
          </div>
          <button (click)="logout()" style="padding: 10px 18px; background-color: #c92a2a; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            Cerrar Sesión
          </button>
        </div>

        <div style="background-color: #eef4fc; padding: 20px; border-radius: 6px; border-left: 5px solid #003366; margin-bottom: 25px;">
          <h2 style="margin: 0 0 8px 0; color: #003366; font-size: 18px;">¡Sesión Iniciada Con Éxito!</h2>
          <p style="margin: 0; color: #333; font-size: 14px;">Bienvenido al panel principal de gestión de nómina para el cuerpo docente.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;">
          <div style="border: 1px solid #e0e0e0; padding: 15px; border-radius: 6px; background: #fafafa;">
            <h3 style="margin: 0 0 5px 0; color: #003366;">Docentes</h3>
            <p style="margin: 0; font-size: 20px; font-weight: bold; color: #333;">24 Registrados</p>
          </div>
          <div style="border: 1px solid #e0e0e0; padding: 15px; border-radius: 6px; background: #fafafa;">
            <h3 style="margin: 0 0 5px 0; color: #003366;">Nómina Activa</h3>
            <p style="margin: 0; font-size: 20px; font-weight: bold; color: #2b8a3e;">Procesada</p>
          </div>
          <div style="border: 1px solid #e0e0e0; padding: 15px; border-radius: 6px; background: #fafafa;">
            <h3 style="margin: 0 0 5px 0; color: #003366;">Periodo</h3>
            <p style="margin: 0; font-size: 20px; font-weight: bold; color: #333;">2026 - II</p>
          </div>
        </div>

      </div>
    </div>
  `
})
export class DashboardComponent {

  constructor(private router: Router) {}

  logout(): void {
    this.router.navigate(['/login']);
  }
}
