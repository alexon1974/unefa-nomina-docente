import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f0f2f5; font-family: Arial, sans-serif;">
      <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center;">
        <div style="background-color: #003366; color: white; border-radius: 50%; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto; font-weight: bold; font-size: 18px;">
          UNEFA
        </div>
        <h2 style="color: #003366; margin-bottom: 5px;">UNEFA - Sistema de Nómina</h2>
        <p style="color: #666; font-size: 14px; margin-bottom: 25px;">Área de Ingeniería | Coordinación Académica</p>

        <form (ngSubmit)="onLogin()">
          <div style="text-align: left; margin-bottom: 15px;">
            <label style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 5px;">Cédula de Identidad:</label>
            <input type="text" [(ngModel)]="cedula" name="cedula" placeholder="Ej: 00000000" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
          </div>
          <div style="text-align: left; margin-bottom: 20px;">
            <label style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 5px;">Contraseña:</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
          </div>
          <button type="submit" style="width: 100%; padding: 12px; background-color: #003366; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer;">
            Iniciar Sesión
          </button>
        </form>

        <div style="margin-top: 20px; font-size: 12px; color: #777;">
          <strong>Credenciales de Prueba:</strong><br>
          Cédula: 00000000 | Pass: Admin123*
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  cedula: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin(): void {
    // Navigates directly to the dashboard
    this.router.navigate(['/dashboard']);
  }
}
