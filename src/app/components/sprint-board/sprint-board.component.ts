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
import { switchMap, takeUntil } from 'rxjs/operators';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDivider } from '@angular/material/divider';

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
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  readonly dialog = inject(MatDialog);

  // Subject para cancelar las suscripciones cuando el componente se destruye
  private destroy$ = new Subject<void>();

  selectedProject: Project | null = null;
  currentSprint: Sprint | null = null;
  todo: Task[] = [];
  done: Task[] = [];
  description: string = "";
  goal: string = "";
  sprintNumber: number = 0;
  indexSprint: number = 0;
  taskState: number = 0;

  ngOnInit() {
    // Suscribirse al proyecto seleccionado
    this.projectService.getSelectedProject().pipe(
      takeUntil(this.destroy$)
    ).subscribe((project) => {
      this.selectedProject = project;
      if (project) {
        // Llamar al método que obtiene los sprints para el proyecto
        this.sprintService.getSprintsByProjectId(project.Id).pipe(
          takeUntil(this.destroy$)
        ).subscribe((sprints) => {
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
    if (this.selectedProject?.Sprints && this.indexSprint > 0) {
      this.indexSprint--;
      this.currentSprint = this.selectedProject.Sprints[this.indexSprint];
      this.updateSprintData();
    }
    console.log(this.currentSprint);
  }

  forwardSprint() {
    if (this.selectedProject?.Sprints && this.indexSprint < this.selectedProject.Sprints.length - 1) {
      this.indexSprint++;
      this.currentSprint = this.selectedProject.Sprints[this.indexSprint];
      this.updateSprintData();
    }
    console.log(this.currentSprint);
  }

  private updateSprintData() {
    if (!this.currentSprint || !this.selectedProject) return;

    // Obtener las tareas del sprint actual usando el SprintId
    this.http.get<Task[]>(`http://localhost:5038/Task/GetTasksBySprintId/${this.currentSprint.Id}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks: Task[]) => {
          // Actualizar la lista "done" con las tareas del sprint
          this.done = tasks;
          // Actualizar "todo" con las tareas del ProductBacklog
          if(!this.selectedProject)return;
          this.projectService.getProductBacklogById(this.selectedProject.Id).pipe(
            takeUntil(this.destroy$)
          ).subscribe({
            next: (backlog: ProductBacklog) => {
              this.todo = backlog.Tasks || [];
              this.cdr.markForCheck();
            }
          });
          if(!this.currentSprint)return;
          this.goal = this.currentSprint.Goal || "";
          this.sprintNumber = this.currentSprint.Id;
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

    if (this.selectedProject?.ProductBacklog) {
      this.selectedProject.ProductBacklog.Tasks = this.todo;
    }
    if (this.currentSprint) {
      this.currentSprint.Tasks = this.done;
    }
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
