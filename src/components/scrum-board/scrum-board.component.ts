import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { AddTaskComponent } from '../dialogs/add-task/add-task.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-scrum-board',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './scrum-board.component.html',
  styleUrls: ['./scrum-board.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrumBoardComponent {
  readonly dialog = inject(MatDialog);
  todo = ['', 'task 1', '', ''];
  progress = ['', '', 'task 2', ''];
  review = ['', '', '','task 3'];
  done = ['task 4','', '', ''];

  drop(event: CdkDragDrop<string[]>) {
    if ( event.previousIndex !== event.currentIndex) {
      // Si se mueve dentro de la misma lista, no hacer nada
      return;
    } 
      const temp = event.previousContainer.data[event.previousIndex];
      const temp2 = event.container.data[event.currentIndex];
      event.container.data[event.currentIndex] = temp;
      event.previousContainer.data[event.previousIndex] = temp2;
  }
  openAddTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, {width: '70%'});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}