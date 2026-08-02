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
  styleUrls: []
})
export class LoginComponent {
  cedula: string = '';
  password: string = '';
  errorMessage: string = '';

  // Embedded base64 SVG logo fallback so it renders without external file dependencies
  logoSvg: string = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23003366"/><text x="50" y="58" font-size="22" text-anchor="middle" fill="white" font-weight="bold">UNEFA</text></svg>';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';
    if (!this.cedula || !this.password) {
      this.errorMessage = 'Por favor ingrese cédula y contraseña.';
      return;
    }

    if (this.authService.login(this.cedula, this.password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Cédula o contraseña incorrectos.';
    }
  }
}
