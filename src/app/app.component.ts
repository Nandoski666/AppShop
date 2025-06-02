import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shp-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="app-container fade-in">
      <!-- Header Global (solo se muestra si está autenticado) -->
      @if (isAuthenticated()) {
        <header class="header">
          <div class="header__inner">
            <h1 class="brand brand-text">Panadería Sophy</h1>
            <nav class="nav">
              <a class="nav-link" routerLink="/inicio">
                <i class="fas fa-home"></i> Inicio
              </a>
              <a class="nav-link" routerLink="/carrito">
                <i class="fas fa-shopping-cart"></i> Carrito
              </a>
              <a class="nav-link" routerLink="/mi-perfil">
                <i class="fas fa-user"></i> Mi Perfil
              </a>
              <button class="nav-link btn-logout" (click)="logout()">
                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
              </button>
            </nav>
          </div>
        </header>
      }

      <!-- Contenido Principal -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer (solo se muestra si está autenticado) -->
      @if (isAuthenticated()) {
        <footer class="footer">
          <div class="container">
            <div class="row">
              <div class="col">
                <h3 class="brand-text">Panadería Sophy</h3>
                <p>Deliciosos productos horneados con amor</p>
              </div>
              <div class="col">
                <h4>Enlaces Rápidos</h4>
                <nav class="footer-nav">
                  <a routerLink="/home">Inicio</a>
                  <a routerLink="/carrito">Carrito</a>
                  <a routerLink="/mi-perfil">Mi Perfil</a>
                </nav>
              </div>
              <div class="col">
                <h4>Contacto</h4>
                <div class="contact-info">
                  <p><i class="fas fa-phone"></i> (123) 456-7890</p>
                  <p><i class="fas fa-envelope"></i> info&#64;panaderiasophy.com</p>
                  <p><i class="fas fa-map-marker-alt"></i> Calle Principal #123</p>
                </div>
              </div>
            </div>
            <div class="footer-bottom">
              <p>&copy; {{currentYear}} Panadería Sophy. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      }
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: var(--box-shadow);
    }

    .header__inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      color: white;
      margin: 0;
      font-size: 2rem;
    }

    .nav {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: var(--transition);
      font-weight: 500;
    }

    .nav-link:hover {
      opacity: 0.8;
      transform: translateY(-2px);
    }

    .btn-logout {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }

    .main-content {
      flex: 1;
      padding: 2rem 0;
      background-color: var(--background-light);
    }

    .footer {
      background: var(--primary-color);
      color: white;
      padding: 4rem 0 2rem;
    }

    .footer h3, .footer h4 {
      color: white;
      margin-bottom: 1.5rem;
    }

    .footer-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer-nav a {
      color: white;
      text-decoration: none;
      transition: var(--transition);
    }

    .footer-nav a:hover {
      opacity: 0.8;
      transform: translateX(5px);
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .contact-info p {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .footer-bottom {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
    }

    @media (max-width: 768px) {
      .header__inner {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .nav {
        flex-direction: column;
        gap: 1rem;
      }

      .footer .row {
        flex-direction: column;
        text-align: center;
        gap: 2rem;
      }

      .footer-nav, .contact-info {
        align-items: center;
      }
    }
  `]
})
export class AppComponent {
  currentYear = new Date().getFullYear();

  isAuthenticated(): boolean {
    const userSession = localStorage.getItem('userSession');
    return userSession !== null;
  }

  logout(): void {
    localStorage.removeItem('userSession');
    window.location.href = '/';
  }
}
