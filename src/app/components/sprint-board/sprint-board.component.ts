import { Component, OnInit, ChangeDetectorRef, inject, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDragHandle } from '@angular/cdk/drag-drop';
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
import { distinctUntilChanged, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDivider } from '@angular/material/divider';
import { TaskService } from '../../services/task.service';
import { AddSprintComponent } from '../dialogs/add-sprint/add-sprint.component';
import { UserService } from '../../services/user.service';
import { Developer } from '../../entities/developer.entity';
import { ENVIRONMENT } from '../../../enviroments/enviroment.prod';
import { DeleteConfirmComponent } from '../dialogs/delete-confirm/delete-confirm.component';
import { EditTaskComponent } from '../dialogs/edit-task/edit-task.component';
import { CdkMenuModule, CdkMenuTrigger } from '@angular/cdk/menu';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ConfirmUpdateComponent } from '../dialogs/confirm-update/confirm-update.component';
import { DeveloperTaskDto } from '../../dtos/developertask.dto';

@Component({
  selector: 'app-sprint-board',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule, CdkDrag, CdkDropList, MatGridListModule, MatDivider,
    CdkMenuTrigger, CdkMenuModule, CdkDragHandle
  ],
  templateUrl: './sprint-board.component.html',
  styleUrls: ['./sprint-board.component.css'],
})

export class SprintBoardComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private sprintService = inject(SprintService);
  private taskService = inject(TaskService);
  // private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  private userService = inject(UserService);
  readonly dialog = inject(MatDialog);
   isSmall = false;
   constructor(private bo:BreakpointObserver, private cdr: ChangeDetectorRef,){}
   isSmallScreen(): boolean {
    return this.bo.isMatched('(max-width: 767px)');
  }

  // Subject para cancelar las suscripciones cuando el componente se destruye
  private destroy$ = new Subject<void>();
  sprints: Sprint[] = [];
  selectedProject: Project | null = null;
  currentSprint: Sprint | null = null;
  todo: Task[] = [];
  done: Task[] = [];
  devs:  [string, number][]=[];
  description: string = "";
  goal: string = "";
  ids: number[] = [];
  responsibleName: string = "";
  sprintNumber: number = 0;
  sprintId:number=0;
  backlogId:number=0;
  indexSprint: number = 0;
  taskState: number = 0;
  userId: number = 0;
  userRol: boolean = false;

  ngOnInit() {
    this.bo
    .observe('(max-width: 767px)')
    .subscribe(state => {
      this.isSmall = state.matches;
      this.cdr.markForCheck();  // fuerza re-render
    });
    // Suscribirse al proyecto seleccionado
    this.userService.userId$.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      console.log(id)
      this.userId = id;
    });

    this.userService.userRol$.pipe(takeUntil(this.destroy$)).subscribe((rol) => {
      this.userRol = rol;
      this.cdr.markForCheck();
    });

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

  onCompleteSprint() {
    this.sprintId;

    const dialogRef = this.dialog.open(ConfirmUpdateComponent, {
      width: '320px'
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        // this.http
        //   .patch<void>(
        //     `${ENVIRONMENT}Sprint/UpdateStateSprint/${this.sprintId}`,
        //     {}
        //   )
        this.sprintService.updateStateSprint(this.sprintId).subscribe({
            next: () => {
              console.log('Sprint marcado como completado');
              this.cdr.markForCheck();
              this.cdr.detectChanges();
            },
            error: err => {
              console.error('Error al completar sprint', err);
            }
          });
      }
    });
    console.log('Sprint completado:', this.sprintNumber);
  }

  async onEdit(task: Task) {
    const ref = this.dialog.open<EditTaskComponent, Task, Task>(
      EditTaskComponent,
      { width: '70%', data: task }
    );

    ref.afterClosed().subscribe(confirm => {
      this.ngOnInit();
      console.log("ya")
    });
  }

  onDelete(task: Task | null) {
    if (!task) return;
  
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '320px',
      data: { name: task?.Name }
    });
  
    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
  
      this.taskService.deleteTaskById(task.Id).subscribe({
        next: () => {
          // Vuelve a ejecutar ngOnInit para recargar todo
          this.ngOnInit();
        },
        error: err => {
          console.error('Error al borrar la tarea:', err);
        }
      });
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
    console.log(this.sprints);
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
    // this.http.get<Task[]>(`${ENVIRONMENT}Task/GetTasksBySprintId/${this.currentSprint.Id}`)
      this.taskService.getTasksBySprintId(this.currentSprint.Id).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks: Task[]) => {
          // Actualizamos las tareas del sprint
          this.done = tasks || [];
          // console.log(this.done);
          this.ids=this.done.map(x=>x.Id);
          console.log(this.ids);
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
          if(this.ids.length>0){//puede ir vacio si no hay tareas en el sprint 
            // console.log(JSON.stringify(ids));
            // this.http.post<DeveloperTask[]>(`${ENVIRONMENT}User/GetDevelopersByTasksIds`, this.ids)
            
            this.userService.getDevelopersByTasksIds(this.ids).pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (developers: DeveloperTaskDto[]) => {
                console.log('Desarrolladores obtenidos:', developers);
                
                // Guardar la respuesta en `devs`
                this.devs= developers.map(dev => [dev.DeveloperName, dev.TaskId]);

                console.log('Lista de desarrolladores y tareas:', this.devs);
              },
              error: (err) => {
                console.error('Error al obtener desarrolladores:', err);
              }
            });
          }

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
    this.responsibleName=this.devs.find(dev=>task.Id==dev[1])?.[0]??"";
    // this.responsibleName = "";
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

  openAddSprint(): void {
    const dialogRef = this.dialog.open(AddSprintComponent, { width: '70%' });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        // Si cerró sin crear sprint o no hay proyecto seleccionado, salimos
        if (!result || !this.selectedProject) {
          return;
        }
        console.log("SI LLEGO")
        // Si sí creó un sprint, refrescamos proyecto y luego sprints
        this.projectService.refreshProjectById(this.selectedProject.Id)
          .pipe(
            takeUntil(this.destroy$),
            switchMap(updatedProject => {
              // Actualizamos el proyecto en el servicio
              this.projectService.updateSelectedProject(updatedProject!);
              // Cargamos los sprints del proyecto recién actualizado
              return this.sprintService.getSprintsByProjectId(updatedProject!.Id);
            })
          )
          .subscribe({
            next: sprints => {
              console.log("Sprints actualizados:", sprints);

              this.sprints = sprints;
              // this.currentIndex = 0; // si lo necesitas, reactívalo aquí

              if (sprints.length > 0) {
                this.sprintService.selectSprint(sprints[0]);
              } else {
                this.sprintService.selectSprint(null);
              }

              // forzamos detección
              this.cdr.markForCheck();
            },
            error: err => {
              console.error("Error refrescando los sprints:", err);
            }
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
