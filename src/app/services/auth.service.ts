import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersKey = 'unefa_app_users';
  private sessionKey = 'unefa_active_user';

  constructor(private router: Router) {
    this.initDefaultAdmin();
  }

  private initDefaultAdmin(): void {
    const existingUsers = localStorage.getItem(this.usersKey);
    let users = existingUsers ? JSON.parse(existingUsers) : [];

    const adminExists = users.some((u: any) => String(u.cedula) === '00000000');
    if (!adminExists) {
      users.push({
        cedula: '00000000',
        password: 'Admin123*',
        role: 'Admin',
        nombre: 'Administrador Principal'
      });
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
  }

  login(cedula: string, password: string): boolean {
    const cleanCedula = String(cedula).trim().replace(/[^0-9]/g, '');
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');

    const user = users.find(
      (u: any) => String(u.cedula) === cleanCedula && u.password === password.trim()
    );

    if (user) {
      localStorage.setItem(this.sessionKey, JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.sessionKey);
  }
}
