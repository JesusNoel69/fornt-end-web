import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-add-sprint',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, CdkDrag, CdkDropList, MatTableModule, MatButtonModule, MatIconModule, MatDivider,
     MatDialogModule, CommonModule
   ],
  templateUrl: './add-sprint.component.html',
  styleUrl: './add-sprint.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSprintComponent {
  todo: string[] = ['Tarea 1', 'Tarea 2', 'Tarea 3'];
  done: string[] = ['Tarea 4', 'Tarea 5', 'Tarea 6', 'Tarea 7', 'Tarea 8', 'Tarea 9', 'Tarea 10', ];
  needPlus3: number=5;

  changePlus3(value:number){
    this.needPlus3=value+3;
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data, 
        event.container.data, 
        event.previousIndex, 
        event.currentIndex
      );
    }
  }
}
