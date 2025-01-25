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
import { concatWith } from 'rxjs';

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
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;
    const prevList = event.previousContainer.data;
    const currList = event.container.data;

    // Validar que el drop esté dentro del rango válido de la lista destino
    if (currIndex >= currList.length) {
      console.warn('Drop fuera del rango válido');
      return; // Salir si el índice está fuera del rango
    }

    if (event.previousContainer === event.container) {
      //misma lista
      this.reorderWithinList(prevList, prevIndex, currIndex);
      this.syncColumns(prevIndex, currIndex, prevList);
    } else {
      //entre listas
      this.exchangeBetweenLists(prevList, currList, prevIndex, currIndex);
    }

    console.log(this.columns);
  }

  reorderWithinList(list: string[], prevIndex: number, currIndex: number): void {
    const item = list[prevIndex];
    //elimina el elemento de su posición anterior
    list.splice(prevIndex, 1);
    //inserta el elemento en la nueva posición
    list.splice(currIndex, 0, item);
    // que no exceda el tamaño
    while (list.length < this.columns[0].length) {
      list.push('');
    }
  }

  //intercambia valores entre dos listas en posiciones específicas.
  exchangeBetweenLists(
    prevList: string[],
    currList: string[],
    prevIndex: number,
    currIndex: number
  ): void {
    const prevItem = prevList[prevIndex];
    const currItem = currList[currIndex];

    currList[currIndex] = prevItem;
    prevList[prevIndex] = currItem;

    this.syncColumns();
  }

  //sincroniza las demás columnas después de un movimiento manteniendo la estructura.
   
  syncColumns(prevIndex?: number, currIndex?: number, currentColumn?: string[]): void {
    this.columns.forEach((column) => {
      // Si es el movimiento dentro de una misma lista, ignora la lista actual
      if (currentColumn && column === currentColumn) {
        return;
      }

      if (prevIndex !== undefined && currIndex !== undefined) {
        if (prevIndex < currIndex) {
          //hacia abajo
          for (let i = prevIndex; i < currIndex; i++) {
            column[i] = column[i + 1] || '';
          }
          column[currIndex] = '';
        } else if (prevIndex > currIndex) {
          //hacia arriba
          for (let i = prevIndex; i > currIndex; i--) {
            column[i] = column[i - 1] || '';
          }
          column[currIndex] = '';
        }
      }
    });

    // todas las lista con el mismo tamaño
    this.columns.forEach((column) => {
      while (column.length > this.columns[0].length) {
        column.pop(); // eliminar cualquier elemento extra fuera del rango
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

