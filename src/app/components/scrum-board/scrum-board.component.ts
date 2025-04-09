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
import { Subject, firstValueFrom, of } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { ProductBacklog } from '../../entities/productbacklog.entity';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';

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
  private taskService = inject(TaskService);
  userId!: number;
  userRol!: boolean;
  todo: (Task | null)[] = [];
  progress: (Task | null)[] = [];
  review: (Task | null)[] = [];
  done: (Task | null)[] = [];
  columns: (Task | null)[][] = [this.todo, this.progress, this.review, this.done];
  constructor(private userService: UserService){}
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
        if (backlog && backlog.Tasks) {
          console.log("i enter");

          this.loadTasks(backlog.Tasks);
        }
        this.cdr.markForCheck();
      });

      this.userService.userId$.pipe(takeUntil(this.destroy$)).subscribe((id) => {
        this.userId = id;
        // this.loadProjects(); // Recargar proyectos al cambiar el usuario
  
      });
  
      this.userService.userRol$.pipe(takeUntil(this.destroy$)).subscribe((rol) => {
        this.userRol = rol;
        this.cdr.markForCheck();
      });
  }

  loadTasks(tasks: Task[]) {
    // Reinicia las columnas
    tasks.sort((a, b) => a.Order - b.Order);
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
    this.updateGlobalOrder();
  }

  updateGlobalOrder(){
    console.log(this.todo.length+" "+this.review.length+" "+this.progress.length+" "+this.done.length+" ")
    this.todo.forEach((task, index)=>{
      if(task !== null){
        task.Order=index+1;
      }
    });
    this.review.forEach((task, index)=>{
      if(task !== null){
        task.Order=index+1;
      }
    });
    this.progress.forEach((task, index)=>{
      if(task !== null){
        task.Order=index+1;
      }
    });
    this.done.forEach((task, index)=>{
      if(task !== null){
        task.Order=index+1;
      }
    });
    const allTasks: Task[] = [
      ...this.todo.filter((task): task is Task => task !== null),
      ...this.progress.filter((task): task is Task => task !== null),
      ...this.review.filter((task): task is Task => task !== null),
      ...this.done.filter((task): task is Task => task !== null),
    ];
    const tasksToUpdate = allTasks.filter(allTasks => allTasks !== null) as Task[];
    this.taskService.updateTasksOrder(this.userId,tasksToUpdate)
      .subscribe((result:any) => {
        console.log(result);
        // if (result) {
        //   console.log('Orden de tareas actualizado correctamente');
        // } else {
        //   console.warn('No se pudo actualizar el orden de las tareas');
        // }
      });
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
    let listTasksToUpdate =this.mergeTasks();
    console.log("terminados?", listTasksToUpdate);
    this.taskService.updateTasksState(this.userId,listTasksToUpdate)
      .subscribe((result) => {//manejar bien los errores
        console.log(result);
        // if (result) {
        //   console.log('Estados de las tareas actualizados correctamente');
        // } else {
        //   console.warn('No se pudo actualizar los estados de las tareas');
        // }
      });

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

  //auxiliar methods
  mergeTasks(): Task[] {
    const mergedTasks: Task[] = [];
  
    // Tareas en "todo" (estado 1)
    this.todo.forEach(task => {
      if (task !== null) {
        task.State = 1;
        mergedTasks.push(task);
      }
    });
  
    // Tareas en "progress" (estado 2)
    this.progress.forEach(task => {
      if (task !== null) {
        task.State = 2;
        mergedTasks.push(task);
      }
    });
  
    // Tareas en "review" (estado 3)
    this.review.forEach(task => {
      if (task !== null) {
        task.State = 3;
        mergedTasks.push(task);
      }
    });
  
    // Tareas en "done" (estado 4)
    this.done.forEach(task => {
      if (task !== null) {
        task.State = 4;
        mergedTasks.push(task);
      }
    });
  
    return mergedTasks;
  }
  


  async openAddTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, { 
      width: '70%',
      disableClose: true 
    });
  
    try {
      const updatedBacklog: ProductBacklog | null = await firstValueFrom(dialogRef.afterClosed());
      console.log("Backlog recibido al cerrar el diálogo:", updatedBacklog);
  
      if (updatedBacklog && updatedBacklog.Tasks) {
        this.loadTasks(updatedBacklog.Tasks);
      }
      this.cdr.markForCheck();
      this.cdr.detectChanges();

    } catch (error) {
      console.error("Error al esperar el cierre del diálogo:", error);
    }
    this.ngOnInit();
  }
  
  
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
