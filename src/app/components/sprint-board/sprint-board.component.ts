import { Component, OnInit, ChangeDetectorRef, inject, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { GeneralInformationComponent } from '../dialogs/general-information/general-information.component';
import { AddTaskComponent } from '../dialogs/add-task/add-task.component';
import { ProjectService } from '../../services/project.service';
import { SprintService } from '../../services/sprint.service';
import { Sprint } from '../../entities/sprint.entity';
import { Task } from '../../entities/Task.entity';
import { ProductBacklog } from '../../entities/productbacklog.entity';
import { Project } from '../../entities/project.entity';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDivider } from '@angular/material/divider';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-sprint-board',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule, CdkDrag, CdkDropList, MatGridListModule, MatDivider],
  templateUrl: './sprint-board.component.html',
  styleUrls: ['./sprint-board.component.css'],
})

export class SprintBoardComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private sprintService = inject(SprintService);
  private taskService = inject(TaskService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  readonly dialog = inject(MatDialog);

  // Subject para cancelar las suscripciones cuando el componente se destruye
  private destroy$ = new Subject<void>();
  sprints: Sprint[] = [];
  selectedProject: Project | null = null;
  currentSprint: Sprint | null = null;
  todo: Task[] = [];
  done: Task[] = [];
  description: string = "";
  goal: string = "";
  sprintNumber: number = 0;
  sprintId:number=0;
  backlogId:number=0;
  indexSprint: number = 0;
  taskState: number = 0;

  ngOnInit() {
    // Suscribirse al proyecto seleccionado
    this.done=[];
    this.projectService.getSelectedProject().pipe(
      takeUntil(this.destroy$)
    ).subscribe((project) => {
      if (project) {
        this.selectedProject = project;

        // Obtener los sprints para el proyecto y guardarlos en la propiedad "sprints"
        this.sprintService.getSprintsByProjectId(project.Id).pipe(
          takeUntil(this.destroy$)
        ).subscribe((sprints) => {
          this.sprints = sprints; // Asignar los sprints a la propiedad local
          if (sprints.length > 0) {
            this.indexSprint = sprints.length - 1; // Seleccionamos, por ejemplo, el último sprint
            this.sprintService.selectSprint(sprints[this.indexSprint]);
          } else {
            this.sprintService.selectSprint(null);
          }
          this.cdr.markForCheck();
        });
      }
    });

    // Suscribirse al sprint seleccionado
    this.sprintService.getSelectedSprint().pipe(
      takeUntil(this.destroy$)
    ).subscribe((sprint) => {
      this.currentSprint = sprint;
      if (sprint && this.selectedProject) {
        this.updateSprintData();
      }
      this.cdr.markForCheck();
    });
  }

  getCircleClass(state: number): string {
    switch (state) {
      case 1: return 'circle state-1';
      case 2: return 'circle state-2';
      case 3: return 'circle state-3';
      case 4: return 'circle state-4';
      default: return '';
    }
  }

  backSprint() {
    if (this.sprints && this.indexSprint > 0) {
      this.indexSprint--;
      this.currentSprint = this.sprints[this.indexSprint];
      this.sprintService.selectSprint(this.currentSprint);
      this.updateSprintData();
    }
    console.log(this.currentSprint);
  }

  forwardSprint() {
    if (this.sprints && this.indexSprint < this.sprints.length - 1) {
      this.indexSprint++;
      this.currentSprint = this.sprints[this.indexSprint];
      this.sprintService.selectSprint(this.currentSprint);
      this.updateSprintData();
    }
    console.log(this.currentSprint);
  }


  private updateSprintData() {
    if (!this.currentSprint || !this.selectedProject) return;
  
    // Obtener las tareas del sprint actual
    this.http.get<Task[]>(`http://localhost:5038/Task/GetTasksBySprintId/${this.currentSprint.Id}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks: Task[]) => {
          // Actualizamos las tareas del sprint
          this.done = tasks || [];
          
          // Obtenemos el Product Backlog mediante el servicio (basado en el id del proyecto)
          if(!this.selectedProject)return;
          this.projectService.getProductBacklogById(this.selectedProject.Id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (backlog: ProductBacklog) => {
                // Ordenamos las tareas del backlog y las asignamos a 'todo'
                this.todo = (backlog.Tasks || []).sort((a, b) => a.Order - b.Order);
                this.backlogId=backlog.Id;
                this.cdr.markForCheck();
              },
              error: (err) => {
                console.error("Error al obtener el Product Backlog:", err);
              }
            });
  
          // Actualizamos otros datos del sprint
          if(!this.currentSprint)return;
          this.goal = this.currentSprint.Goal || "";
          this.sprintNumber = this.currentSprint.Id;
          this.sprintId=this.currentSprint.Id;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error("Error al obtener tareas del sprint:", err);
        }
      });
  }
  

  showDetails(task: Task) {
    this.description = task.Description;
    this.taskState = task.State;
  }

  drop(event: CdkDragDrop<Task[]>) {
    // Obtener los datos con un fallback a un array vacío, en caso de que sean null
    let prevData: Task[] = event.previousContainer.data;
    console.log(event.container.data);
    let currData: Task[] = event.container.data;


    // if (!prevData || !currData) {
    //   console.error('Uno de los contenedores no tiene datos inicializados');
    //   return;
    // }
    if (!currData) {
      currData = [];
      event.container.data = []; // Actualiza la referencia en el contenedor
    }
    // if (event.previousContainer === event.container) {
    //   // Solo si el contenedor tiene datos
    //   // if (currData) {
    //     console.log("entro ")
    //     moveItemInArray(currData, event.previousIndex, event.currentIndex);
    //   // }
    // } else {
      // if (prevData && currData) {
      console.log("no entro")
        transferArrayItem(prevData, currData, event.previousIndex, event.currentIndex);
      // }
    // }
    // if (event.previousContainer === event.container) {
    //   if (currData) 
    //   moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    // } else {
    //   if(prevData && currData)
    //   transferArrayItem(
    //     event.previousContainer.data, 
    //     event.container.data, 
    //     event.previousIndex, 
    //     event.currentIndex
    //   );
    // }
    
    // Construir el payload para actualizar las tareas
    const payload = {
      backlog: { tasks: this.todo, backlogId: this.backlogId },
      sprint: { tasks: this.done, sprintId: this.sprintId }
    };
  
    console.log("Payload:", payload);
    
    this.taskService.updateTasksSprint(payload)
      .subscribe({
        next: (response) => {
          console.log("Tareas actualizadas correctamente", response);
        },
        error: (error) => {
          console.error("Error al actualizar las tareas", error);
        }
      });
  }
  
  

  openGeneralInformation() {
    if (!this.currentSprint) return;
    const dialogRef = this.dialog.open(GeneralInformationComponent, {
      width: '70%',
      data: { sprint: this.currentSprint }
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
  }

  openAddTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, { width: '70%' });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.updateSprintData();
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
