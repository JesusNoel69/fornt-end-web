import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

// export interface Projects {
//   sprints: Sprints[];
// }
// export interface Sprints {
//   tareas: string[];
// }

@Component({
  selector: 'app-changes-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatCardModule],
  templateUrl: './changes-details.component.html',
  styleUrls: ['./changes-details.component.css'], // Corregido 'styleUrl' a 'styleUrls'
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangesDetailsComponent {
  projects = [
    {
      id: 1,
      name: 'Proyecto Alpha',
      sprints: [
        { id: 1, name: 'Sprint 1' },
        { id: 2, name: 'Sprint 2' }
      ]
    },
    {
      id: 2,
      name: 'Proyecto Beta',
      sprints: [
        { id: 1, name: 'Sprint 1' },
        { id: 2, name: 'Sprint 2' }
      ]
    }
  ];

}
