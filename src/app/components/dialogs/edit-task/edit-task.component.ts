import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../entities/project.entity';
import { Task } from '../../../entities/Task.entity';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Developer } from '../../../entities/developer.entity';
import { HttpClient } from '@angular/common/http';
import { ProductBacklog } from '../../../entities/productbacklog.entity';
import { Subject, firstValueFrom, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ENVIROMENT } from '../../../../enviroments/enviroment.prod';
import { WeeklyScrum } from '../../../entities/weeklyscrum.entity';
import { TaskService } from '../../../services/task.service';
interface UpdateTaskDTO{
  Task: Task,
  UserId?: number
}


@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private project: Project | null = null;
  private destroy$ = new Subject<void>();

  states: number[] = [1, 2, 3, 4]; // Estados posibles
  currentState: number = 1;
  public taskId: number =0;
  public taskName: string = '';
  public taskInformation: string = '';
  public userId : number =0;
  // public taskWeeklyScrum: WeeklyScrum[] = []//null as any;
  public selectedResponsable: Developer = null as any;
  public developers: Developer[] = [];
  productBacklog: ProductBacklog = null as any;

  constructor(private projectService: ProjectService, private http: HttpClient,
    private dialogRef: MatDialogRef<EditTaskComponent>, @Inject(MAT_DIALOG_DATA) public task: Task, private taskService: TaskService,) {}

  ngOnInit(): void {
    // Suscribirse al proyecto seleccionado
    this.projectService.getSelectedProject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((project) => {
        console.log(project);
        if (project) {
          this.project = project;

          // Obtener el ProductBacklog del proyecto
          this.projectService.getProductBacklogById(project.Id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (backlog) => {
                this.productBacklog = backlog;
                console.log("backlog: ", this.productBacklog);
              }
            });

          // Obtener los developers asociados al proyecto
          this.projectService.getTeamProjectsByProjectId(project.Id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (developers) => {
                this.developers = developers;
                console.log("Developers recibidos:", developers);
              },
              error: (error) => {
                console.error("Error al obtener los developers:", error);
              }
            });
        }
      });
      console.log("la tarea es: ",this.task);
      if (this.task) {
        this.taskName           = this.task.Name;
        this.taskInformation    = this.task.Description;
        this.currentState       = this.task.State;
        this.taskId=this.task.Id;
        this.userId = this.selectedResponsable?.Id ?? 0;
      }
  }
  setState(index: number): void {
    this.currentState = this.states[index];
  }

  getCircleClass(state: number): string {
    switch (state) {
      case 1:
        return 'circle state-1';
      case 2:
        return 'circle state-2';
      case 3:
        return 'circle state-3';
      case 4:
        return 'circle state-4';
      default:
        return '';
    }
  }
  confirm(): void {
    // Preparamos el payload
    const payload: UpdateTaskDTO = {
      UserId: this.userId,
      Task: {
        ...this.task,
        Id:           this.task.Id,
        Name:         this.taskName,
        Description:  this.taskInformation,
        State:        this.currentState
      }
    };
  
    // Llamada al servicio
    this.taskService.updateTask(payload)
      // .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Tarea actualizada en backend:', payload.Task);
          // CIERRA el diálogo **devolviendo** el Task actualizado
          this.dialogRef.close(true);//payload.Task);
        },
        error: err => {
          console.error('Error al actualizar tarea', err);
        }
      });
  }
  
  selectResponsable(developer: Developer): void {
    this.selectedResponsable = developer;
    this.userId = developer.Id;

  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
