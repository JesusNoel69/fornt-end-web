import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { AuthService } from '../../authentication/auth.service';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatInputModule, MatIconModule,MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  constructor(private router:Router, private auth: AuthService, private user :UserService){}
  login() {
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);
    
    // Llamada al método login del AuthService
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (response:any) => {
        console.log(response);
        // Guarda el token recibido
        this.auth.setToken(response.token);
        this.auth.setUser(response.user);
        this.user.setUser(response.user.Id, response.user.Rol);
        // Redirige a la ruta principal (por ejemplo, dashboard o sprint board)
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error en login:', err);
      }
    });
  }
  
  register() {
    this.router.navigate(['/register']);
    console.log('Registro de usuario iniciado.');
  }
}