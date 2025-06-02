import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LoginResponse {
  id: number;
  loginUsrio: string;
  correoUsuario: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  email: string = '';
  password: string = '';
  private apiUrl = 'http://172.172.90.61:8181/usuario';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);
        if (userData.loginUsrio === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      } catch (error) {
        console.error('Error parsing user session:', error);
        this.router.navigate(['/home']);
      }
    }
  }

  onLogin(): void {
    // Verificación especial para admin
    if (this.email === 'admin@' && this.password === 'admin') {
      localStorage.setItem('userSession', JSON.stringify({ 
        loginUsrio: 'admin',
        correoUsuario: 'admin@'
      }));
      this.router.navigate(['/admin']);
      return;
    }

    const loginPayload = {
      correoUsuario: this.email,
      claveUsrio: this.password
    };

    this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginPayload, { 
      withCredentials: true 
    }).subscribe({
      next: (response) => {
        localStorage.setItem('userSession', JSON.stringify(response));
        this.router.navigate(['/home']);
      },
      error: (error) => {
        if (error.status === 401) {
          alert('Credenciales incorrectas');
        } else {
          alert('Error al iniciar sesión. Verifica tus datos.');
        }
      }
    });
  }

  irARegistro(): void {
    this.router.navigate(['/register']);
  }

  irARecuperarClave(): void {
    this.router.navigate(['/recuperar-contrasena']);
  }
}

