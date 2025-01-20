import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [MatDialogModule, MatCardModule, MatButtonModule, MatTableModule, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AddTaskComponent {
  states:number[] = [1,2,3,4,5];
}
