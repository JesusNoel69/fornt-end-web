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
  review = ['', '', '', 'task 3'];
  done = ['task 4', '', '', ''];

  columns = [this.todo, this.progress, this.review, this.done];

  drop(event: CdkDragDrop<string[]>) {
    if ( event.previousIndex !== event.currentIndex){
      if(event.container.data[event.currentIndex]!="")return;
      const prevIndex = event.previousIndex;
      const currIndex = event.currentIndex;
      const list = event.container.data;
      const item = list[prevIndex];
      list[prevIndex] = '';
      list[currIndex] = item;
      this.syncColumns(prevIndex, currIndex, event.container.data);
      console.log(this.columns);
    }else{
      const temp = event.previousContainer.data[event.previousIndex];
      const temp2 = event.container.data[event.currentIndex];
      event.container.data[event.currentIndex] = temp;
      event.previousContainer.data[event.previousIndex] = temp2;
    }
  }
  syncColumns(prevIndex: number, currIndex: number, currentColumn: string[]): void {
    this.columns.forEach((column) => {
      if (column === currentColumn) {//ya se manejo
        return;
      }

      if (prevIndex < currIndex) {
        for (let i = prevIndex; i < currIndex; i++) {
          column[i] = column[i + 1] || ''; //mover hacia arriba
        }
        column[currIndex] = ''; //vaciar la posición final
      } else if (prevIndex > currIndex) {
        for (let i = prevIndex; i > currIndex; i--) {
          column[i] = column[i - 1] || ''; //mover hacia abajo
        }
        column[currIndex] = '';
      }
    });
  }

  openAddTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, { width: '70%' });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
