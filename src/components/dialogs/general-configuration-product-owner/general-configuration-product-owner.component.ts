import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

// export interface Tile {
//   color: string;
//   cols: number;
//   rows: number;
//   text: string;
// }

@Component({
  selector: 'app-general-configuration-product-owner',
  standalone: true,
  imports: [MatDialogModule, MatCardModule, MatButtonModule, MatGridListModule, MatIconModule],
  templateUrl: './general-configuration-product-owner.component.html',
  styleUrl: './general-configuration-product-owner.component.css'
})
export class GeneralConfigurationProductOwnerComponent {
  // tiles: Tile[] = [
  //   {text: 'One', cols: 2, rows: 4, color: 'lightblue'},
  //   {text: 'Two', cols: 2, rows: 2, color: 'lightgreen'},
  //   {text: 'Three', cols: 2, rows: 2, color: 'lightpink'},
  // ];
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Archivo seleccionado:', file.name);
      // Aquí puedes agregar la lógica para subir el archivo
    }
  }
}
