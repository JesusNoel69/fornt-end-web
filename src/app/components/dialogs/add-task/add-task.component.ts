import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { TaskService } from '../../../services/task.service';
import { TaskCreateDto } from '../../../dtos/taskcreate.dto';
@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private project: Project | null = null;
  private destroy$ = new Subject<void>();

  states: number[] = [1, 2, 3, 4]; // Estados posibles
  currentState: number = 1;
  public taskName: string = '';
  public taskInformation: string = '';
  public taskWeeklyScrum: string = '';
  public selectedResponsable: Developer = null as any;
  public developers: Developer[] = [];
  productBacklog: ProductBacklog = null as any;

  constructor(private projectService: ProjectService, private taskService: TaskService,
    private http: HttpClient,   private dialogRef: MatDialogRef<AddTaskComponent>) {}

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
                // console.log("Developers recibidos:", developers);
              },
              error: (error) => {
                console.error("Error al obtener los developers:", error);
              }
            });
        }
      });
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

  selectResponsable(developer: Developer): void {
    this.selectedResponsable = developer;
  }


  async addTask(): Promise<void> {
    if (!this.project) {
      console.warn('No hay un proyecto seleccionado.');
      return;
    }

    const newTask: TaskCreateDto = {
      SprintId: null,
      Name: this.taskName,
      WeeklyScrum: this.taskWeeklyScrum,
      Description: this.taskInformation,
      State: this.currentState,
      Order: 0,
      ProductBacklogId: this.productBacklog.Id,
      DeveloperId: this.selectedResponsable.Id
    };

    const resultAddTask: boolean = await this.taskService.addTaskToProductBacklog(newTask);

    if(resultAddTask){
      const updatedBacklog = await firstValueFrom(this.projectService.getProductBacklogById(this.project!.Id));
      console.log("Backlog actualizado que se enviará al cerrar el diálogo:", updatedBacklog);
      this.dialogRef.close(updatedBacklog);
    }else{
      console.error("Error al agregar la tarea o actualizar el backlog:");
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
