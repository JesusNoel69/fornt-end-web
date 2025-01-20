import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-data-principal',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './data-principal.component.html',
  styleUrl: './data-principal.component.css'
})
export class DataPrincipalComponent {

}
