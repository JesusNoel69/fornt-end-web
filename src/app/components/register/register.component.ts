import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fullName: string = '';
  githubAccount: string = '';
  password: string = '';
  teamId: string = '';

  register() {
    console.log('Registrando usuario con datos:', {
      fullName: this.fullName,
      githubAccount: this.githubAccount,
      password: this.password,
      teamId: this.teamId
    });
  }

  cancel() {
    console.log('Registro cancelado');
    this.fullName = '';
    this.githubAccount = '';
    this.password = '';
    this.teamId = '';
  }
}
