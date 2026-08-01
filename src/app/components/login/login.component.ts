import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
  `]
})
export class LoginComponent {
  cedula: string = '';
  password: string = '';
  errorMessage: string = '';

  logoSvg: string = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" rx="15" fill="%23003366"/><text x="50%" y="55%" font-size="20" font-weight="bold" fill="white" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">UNEFA</text></svg>';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';

    if (!this.cedula || !this.password) {
      this.errorMessage = 'Por favor ingrese Cédula y Contraseña.';
      return;
    }

    const success = this.authService.login(this.cedula, this.password);
    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Cédula o contraseña incorrectas.';
    }
  }
}
