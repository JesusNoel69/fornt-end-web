// import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatTableModule } from '@angular/material/table';
// import {
//   CdkDragDrop,
//   CdkDrag,
//   CdkDropList,
//   CdkDropListGroup,
// } from '@angular/cdk/drag-drop';
// import { AddTaskComponent } from '../dialogs/add-task/add-task.component';
// import { MatDialog } from '@angular/material/dialog';
// import { Task } from '../../entities/Task.entity';
// import { ProjectService } from '../../services/project.service';

// @Component({
//   selector: 'app-scrum-board',
//   standalone: true,
//   imports: [
//     MatTableModule,
//     MatButtonModule,
//     CdkDropListGroup,
//     CdkDropList,
//     CdkDrag,
//   ],
//   templateUrl: './scrum-board.component.html',
//   styleUrls: ['./scrum-board.component.css'],
//   // changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class ScrumBoardComponent implements OnInit {
//   private projectService = inject(ProjectService);
//   private cdr = inject(ChangeDetectorRef);
//   ngOnInit() {
//     this.projectService.getSelectedProject().subscribe((project) => {
//       if (project) {
//         // Llamamos al endpoint para obtener el ProductBacklog por projectId
//         this.projectService.getProductBacklogById(project.Id).subscribe((backlog) => {
//           console.log("i enter")

//           if (backlog && backlog.Tasks) {
//             this.loadTasks(backlog.Tasks);
//           }
//           this.cdr.detectChanges();
//         });
//       }
//     });
//   }
  
  
//   loadTasks(tasks: Task[]) {
//     // clasifica las tareas según el estado
//     this.todo = [];
//     this.progress = [];
//     this.review = [];
//     this.done = [];
//     tasks.forEach(task => {
//       if(task.State===1){
//         this.todo.push(task);
//         this.progress.push(null);
//         this.review.push(null);
//         this.done.push(null);
//       }else if(task.State===2){
//         this.todo.push(null);
//         this.progress.push(task);
//         this.review.push(null);
//         this.done.push(null);
//       }else if(task.State===3){
//         this.todo.push(null);
//         this.progress.push(null);
//         this.review.push(task);
//         this.done.push(null);
//       }else{
//         this.todo.push(null);
//         this.progress.push(null);
//         this.review.push(null);
//         this.done.push(task);
//       }
//     });
//     this.columns = [this.todo, this.progress, this.review, this.done];
//     this.cdr.detectChanges();
//   }
//   readonly dialog = inject(MatDialog);

//   todo: (Task | null)[] = [];
//   progress: (Task | null)[] = [];
//   review: (Task | null)[] = [];
//   done: (Task | null)[] = [];

//   columns: (Task|null)[][] = [this.todo, this.progress, this.review, this.done];
  
//   drop(event: CdkDragDrop<(Task | null)[], any, any>) {
//     const prevIndex = event.previousIndex;
//     const currIndex = event.currentIndex;
//     const prevList = event.previousContainer.data;
//     const currList = event.container.data;

//     // Validar que el drop esté dentro del rango válido de la lista destino
//     if(currList)
//     if (currIndex >= currList.length) {
//       console.warn('Drop fuera del rango válido');
//       return; // Salir si el índice está fuera del rango
//     }

//     if (event.previousContainer === event.container) {
//       //misma lista
//       if(prevList){
//         if(prevList[prevIndex]==null)return;//que no se puedan arrastrar los null
//         this.reorderWithinList(prevList, prevIndex, currIndex);
//       }
//       if(prevList)
//         this.syncColumns(prevIndex, currIndex, prevList);
//     } else {
//       //entre listas
//       if(prevList[prevIndex]==null)return;//que no se puedan arrastrar los null

//       if(prevList || currList)
//         this.exchangeBetweenLists(prevList, currList, prevIndex, currIndex);
//       let columnState:number=1;
//       this.columns.forEach(column => {
        
//         column.forEach(task => {
//           if (task !== null && task !== undefined) {
//             task.State = columnState;
//           }          
//         });
//         columnState++;
//       });
//     }
//   }

//   reorderWithinList(list: (Task|null)[], prevIndex: number, currIndex: number): void {
//     if(!list)return;
//     const item = list[prevIndex];
//     //elimina el elemento de su posición anterior
//     list.splice(prevIndex, 1);
//     //inserta el elemento en la nueva posición
//     list.splice(currIndex, 0, item);
//     // que no exceda el tamaño
//     while (list.length < this.columns[0].length) {
//       list.push(null);
//     }
//   }

//   //intercambia valores entre dos listas en posiciones específicas.
//   exchangeBetweenLists(
//     prevList: (Task|null)[],
//     currList: (Task|null)[],
//     prevIndex: number,
//     currIndex: number
//   ): void {
//     const prevItem = prevList[prevIndex];
//     const currItem = currList[currIndex];

//     if(currIndex!==prevIndex)return;
//     currList[currIndex] = prevItem;
//     prevList[prevIndex] = currItem;
//     console.log(prevList[prevIndex]?.State);
//     console.log(currList[currIndex]?.State);
//     // this.syncColumns();
//   }



//   //sincroniza las demás columnas después de un movimiento manteniendo la estructura.
   
//   syncColumns(prevIndex?: number, currIndex?: number, currentColumn?: Task[]): void {
//     this.columns.forEach((column) => {
//       // Si es el movimiento dentro de una misma lista, ignora la lista actual
//       if (currentColumn && column === currentColumn) {
//         return;
//       }

//       if (prevIndex !== undefined && currIndex !== undefined) {
//         if (prevIndex < currIndex) {
//           // hacia abajo
//           for (let i = prevIndex; i < currIndex; i++) {
//             column[i] = column[i + 1] || null;
//           }
//           column[currIndex] = null;
//         } else if (prevIndex > currIndex) {
//           // hacia arriba
//           for (let i = prevIndex; i > currIndex; i--) {
//             column[i] = column[i - 1] || null;
//           }
//           column[currIndex] = null;
//         }
//       }
      

//     });
    

//     // todas las lista con el mismo tamaño
//     this.columns.forEach((column) => {
//       while (column.length > this.columns[0].length) {
//         column.pop(); // eliminar cualquier elemento extra fuera del rango
//       }
//     });
//   }

//   // openAddTask() {
//   //   const dialogRef = this.dialog.open(AddTaskComponent, { width: '70%' });
//   //   dialogRef.afterClosed().subscribe((newTask: Task | null) => {
//   //     if (newTask) {
//   //       // Agregar la nueva tarea al backlog del tablero
//   //       this.projectService.getSelectedProject().subscribe((project) => {
//   //         if (project && project.ProductBacklog?.Tasks) {
//   //           project.ProductBacklog.Tasks.push(newTask);
//   //           this.loadTasks(project.ProductBacklog.Tasks); // Recargar las tareas en el tablero
//   //           this.cdr.detectChanges();
//   //         }
//   //       });
//   //     }
//   //   });
//   // }
//   openAddTask() {
//     const dialogRef = this.dialog.open(AddTaskComponent, { width: '70%' });
//     dialogRef.afterClosed().subscribe((newTask: Task | null) => {
//       if (newTask) {
//         // Reconsultamos el proyecto seleccionado para obtener el backlog actualizado.
//         this.projectService.getSelectedProject().subscribe((project) => {
//           if (project) {
//             this.projectService.getProductBacklogById(project.Id).subscribe((backlog) => {
//               if (backlog && backlog.Tasks) {
//                 this.loadTasks(backlog.Tasks);
//               }
//               this.cdr.detectChanges();
//             });
//           }
//         });
//       }
//     });
//   }
  

// }

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { AddTaskComponent } from '../dialogs/add-task/add-task.component';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../../entities/Task.entity';
import { ProjectService } from '../../services/project.service';
import { Subject, of } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-scrum-board',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './scrum-board.component.html',
  styleUrls: ['./scrum-board.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrumBoardComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);
  readonly dialog = inject(MatDialog);
  // Subject para cancelar las suscripciones cuando el componente se destruya
  private destroy$ = new Subject<void>();

  todo: (Task | null)[] = [];
  progress: (Task | null)[] = [];
  review: (Task | null)[] = [];
  done: (Task | null)[] = [];
  columns: (Task | null)[][] = [this.todo, this.progress, this.review, this.done];

  ngOnInit() {
    // Suscribirse al proyecto seleccionado y obtener el ProductBacklog actualizado
    this.projectService.getSelectedProject()
      .pipe(
        takeUntil(this.destroy$),
        switchMap(project => {
          if (project) {
            return this.projectService.getProductBacklogById(project.Id);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(backlog => {
        console.log("i enter");
        if (backlog && backlog.Tasks) {
          this.loadTasks(backlog.Tasks);
        }
        this.cdr.markForCheck();
      });
  }

  loadTasks(tasks: Task[]) {
    // Reinicia las columnas
    this.todo = [];
    this.progress = [];
    this.review = [];
    this.done = [];
    
    tasks.forEach(task => {
      if (task.State === 1) {
        this.todo.push(task);
        this.progress.push(null);
        this.review.push(null);
        this.done.push(null);
      } else if (task.State === 2) {
        this.todo.push(null);
        this.progress.push(task);
        this.review.push(null);
        this.done.push(null);
      } else if (task.State === 3) {
        this.todo.push(null);
        this.progress.push(null);
        this.review.push(task);
        this.done.push(null);
      } else {
        this.todo.push(null);
        this.progress.push(null);
        this.review.push(null);
        this.done.push(task);
      }
    });
    this.columns = [this.todo, this.progress, this.review, this.done];
    this.cdr.markForCheck();
  }

  drop(event: CdkDragDrop<(Task | null)[], any, any>) {
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;
    const prevList = event.previousContainer.data;
    const currList = event.container.data;

    // Validar que el drop esté dentro del rango válido de la lista destino
    if (currList && currIndex >= currList.length) {
      console.warn('Drop fuera del rango válido');
      return;
    }

    if (event.previousContainer === event.container) {
      if (prevList) {
        if (prevList[prevIndex] == null) return; // No mover nulos
        this.reorderWithinList(prevList, prevIndex, currIndex);
      }
      if (prevList) {
        this.syncColumns(prevIndex, currIndex, prevList);
      }
    } else {
      if (prevList[prevIndex] == null) return; // No mover nulos
      if (prevList || currList) {
        this.exchangeBetweenLists(prevList, currList, prevIndex, currIndex);
      }
      let columnState: number = 1;
      this.columns.forEach(column => {
        column.forEach(task => {
          if (task !== null && task !== undefined) {
            task.State = columnState;
          }
        });
        columnState++;
      });
    }
  }

  reorderWithinList(list: (Task | null)[], prevIndex: number, currIndex: number): void {
    if (!list) return;
    const item = list[prevIndex];
    list.splice(prevIndex, 1);
    list.splice(currIndex, 0, item);
    while (list.length < this.columns[0].length) {
      list.push(null);
    }
  }

  exchangeBetweenLists(
    prevList: (Task | null)[],
    currList: (Task | null)[],
    prevIndex: number,
    currIndex: number
  ): void {
    const prevItem = prevList[prevIndex];
    const currItem = currList[currIndex];

    if (currIndex !== prevIndex) return;
    currList[currIndex] = prevItem;
    prevList[prevIndex] = currItem;
    console.log(prevList[prevIndex]?.State);
    console.log(currList[currIndex]?.State);
  }

  syncColumns(prevIndex?: number, currIndex?: number, currentColumn?: Task[]): void {
    this.columns.forEach((column) => {
      if (currentColumn && column === currentColumn) return;
      if (prevIndex !== undefined && currIndex !== undefined) {
        if (prevIndex < currIndex) {
          for (let i = prevIndex; i < currIndex; i++) {
            column[i] = column[i + 1] || null;
          }
          column[currIndex] = null;
        } else if (prevIndex > currIndex) {
          for (let i = prevIndex; i > currIndex; i--) {
            column[i] = column[i - 1] || null;
          }
          column[currIndex] = null;
        }
      }
    });
    this.columns.forEach((column) => {
      while (column.length > this.columns[0].length) {
        column.pop();
      }
    });
  }

  openAddTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, { width: '70%' });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((newTask: Task | null) => {
        if (newTask) {
          // Reconsultar el proyecto seleccionado para obtener el backlog actualizado
          this.projectService.getSelectedProject()
            .pipe(
              takeUntil(this.destroy$),
              switchMap(project => {
                if (project) {
                  return this.projectService.getProductBacklogById(project.Id);
                } else {
                  return of(null);
                }
              })
            )
            .subscribe((backlog) => {
              if (backlog && backlog.Tasks) {
                this.loadTasks(backlog.Tasks);
              }
              this.cdr.markForCheck();
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
