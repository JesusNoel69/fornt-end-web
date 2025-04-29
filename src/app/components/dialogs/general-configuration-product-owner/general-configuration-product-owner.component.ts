import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { Developer } from '../../../entities/developer.entity';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ENVIROMENT } from '../../../../enviroments/enviroment.prod';

// export interface Tile {
//   color: string;
//   cols: number;
//   rows: number;
//   text: string;
// }

@Component({
  selector: 'app-general-configuration-product-owner',
  standalone: true,
  imports: [MatDialogModule, MatCardModule, MatButtonModule, MatGridListModule, MatIconModule, FormsModule],
  templateUrl: './general-configuration-product-owner.component.html',
  styleUrl: './general-configuration-product-owner.component.css'
})
export class GeneralConfigurationProductOwnerComponent {
  rol: boolean = false;
  teamCode: number = 0; // 0 o null indica que aún no hay un equipo asignado
  password: string = "";
  account: string = "";
  name: string = "";
  nameSpecialization: string = "";

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Archivo seleccionado:', file.name);
      // Lógica para subir el archivo, si es necesaria
    }
  }

  addNewUser(): void {
    // Se crea el objeto Developer, sin asignar team (Team se asigna a null o se omite)
    const newDeveloper: Developer = {
      Id: 0,
      Rol: this.rol,
      Name: this.name,
      Account: this.account,
      Password: this.password,
      NameSpecialization: this.nameSpecialization,
      Team: null,
      ChangeDetails:null as any,
      ProductOwner: null as any,
      WeeklyScrum: null as any,
      Developer:null as any
    };

    // Llama a un endpoint que se encargue de insertar el Developer sin equipo asignado
    const url = ENVIROMENT+'Project/AddDeveloperWithoutProject'; // Asegúrate de que este endpoint exista en el backend
    this.http.post(url, newDeveloper).subscribe({
      next: (res) => {
        console.log("Usuario agregado con éxito:", res);
        // Aquí puedes actualizar la UI o notificar al usuario
      },
      error: (err) => {
        console.error("Error al agregar usuario:", err);
      }
    });
  }
}

