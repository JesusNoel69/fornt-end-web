import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-general-information',
  standalone: true,
  imports: [MatDialogModule, MatCardModule, MatButtonModule, MatTableModule, CommonModule, MatDivider],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationComponent {
  columns = [
    { initials: 'AJ', color: '#E57373', content: 'Información del Scrum semanal' },
    { initials: 'AJ', color: '#9575CD', content: '' },
    { initials: 'AJ', color: '#4DD0E1', content: '' },
    { initials: 'AJ', color: '#81C784', content: '' },
    { initials: 'AJ', color: '#FFF176', content: '' }
  ];
}
