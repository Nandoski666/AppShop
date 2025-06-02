import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <h2>Mi Perfil</h2>
      <!-- Aquí irá el contenido del perfil -->
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class ProfileComponent {} 