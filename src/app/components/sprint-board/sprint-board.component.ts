
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { GeneralInformationComponent } from '../dialogs/general-information/general-information.component';
import { AddTaskComponent } from '../dialogs/add-task/add-task.component';
import { ProjectService } from '../../services/project.service';
import { Sprint } from '../../entities/sprint.entity';
import { Task } from '../../entities/Task.entity';
import { MatDividerModule } from '@angular/material/divider';
import { Project } from '../../entities/project.entity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sprint-board',
  standalone: true,
  imports: [
    MatGridListModule,
    MatCardModule,
    CdkDrag,
    CdkDropList,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CommonModule
  ],
  templateUrl: './sprint-board.component.html',
  styleUrls: ['./sprint-board.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SprintBoardComponent implements OnInit {
  private projectService = inject(ProjectService);
  readonly dialog = inject(MatDialog);
  constructor(private cdr: ChangeDetectorRef){}
  // Datos del sprint seleccionado
  currentSprint: Sprint | null = null;
  selectedProject: Project | null = null;
  todo: Task[] = [];
  done: Task[] = [];
  description: string = "";
  state: number = 0;
  goal: string = "";
  sprintNumber: number = 0;
  doneBacklog: Task[] = [];
  indexSprint: number = 0; // Se inicializa correctamente
  taskState:number=0;

  ngOnInit() {
    this.projectService.getSelectedProject().subscribe((project) => {
      this.selectedProject = project;

      if (project?.Sprints?.length) {
        // Se toma el último sprint como el actual
        this.indexSprint = project.Sprints.length - 1;
        this.currentSprint = project.Sprints[this.indexSprint];

        // Se actualizan los datos del sprint
        this.updateSprintData();
      }
    });
  }

  getCircleClass(state: number): string {
    console.log(state);
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
  

  backSprint() {
    if (this.selectedProject?.Sprints && this.indexSprint > 0) {
      this.indexSprint--;
      this.currentSprint = this.selectedProject.Sprints[this.indexSprint];
      this.updateSprintData();
    }
    console.log(this.currentSprint)

  }

  forwardSprint() {
    if (this.selectedProject?.Sprints && this.indexSprint < this.selectedProject.Sprints.length - 1) {
      this.indexSprint++;
      this.currentSprint = this.selectedProject.Sprints[this.indexSprint];
      this.updateSprintData();
    }
    console.log(this.currentSprint)
  }

  private updateSprintData() {
    if (!this.currentSprint) return;
    console.log(this.currentSprint)
    this.todo = this.selectedProject?.ProductBacklog?.Tasks ?? [];
    this.done = this.currentSprint?.Tasks ?? [];
    this.goal = this.currentSprint.Goal || "";
    this.sprintNumber = this.currentSprint.Id;
  }

  showDetails(task:Task){
    this.description=task.Description;
    this.taskState=task.State;
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

    if (this.selectedProject?.ProductBacklog?.Tasks) {
      this.selectedProject.ProductBacklog.Tasks = this.todo;
    }

    if (this.currentSprint?.Tasks) {
      this.currentSprint.Tasks = this.done;
    }
  }

  openGeneralInformation() {
    if (!this.currentSprint) return; // Si no hay Sprint seleccionado, no abre el dialogo
  
    const dialogRef = this.dialog.open(GeneralInformationComponent, {
      width: '70%',
      data: { sprint: this.currentSprint } 
    });
  
    dialogRef.afterClosed().subscribe((result) => {//aqui el endpoint
      console.log(`Dialog result: ${result}`);
    });
  }
  
  openAddTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, { width: '70%' });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.updateSprintData(); // Vuelve a cargar los datos del sprint
      this.cdr.detectChanges();
    });
  }
}
