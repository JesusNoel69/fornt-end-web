import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { GeneralInformationComponent } from '../dialogs/general-information/general-information.component';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../dialogs/add-task/add-task.component';



@Component({
  selector: 'app-sprint-board',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, CdkDrag, CdkDropList, MatTableModule, MatButtonModule, MatIconModule, MatDivider],
  templateUrl: './sprint-board.component.html',
  styleUrl: './sprint-board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SprintBoardComponent {
  todo: string[] = ['Tarea 1', 'Tarea 2', 'Tarea 3'];
  done: string[] = ['Tarea 4', 'Tarea 5', 'Tarea 6', 'Tarea 7', 'Tarea 8', 'Tarea 9', 'Tarea 10', 'Tarea 4', 'Tarea 5', 'Tarea 6', 'Tarea 7', 'Tarea 8', 'Tarea 9', 'Tarea 10'];
  needPlus3: number=5;
  readonly dialog = inject(MatDialog);

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
  openGeneralInformation() {
    const dialogRef = this.dialog.open(GeneralInformationComponent, {width: '70%'});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
    openAddTask() {
      const dialogRef = this.dialog.open(AddTaskComponent, {width: '70%'});
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });    
    }
}
