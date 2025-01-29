
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
    MatDividerModule
  ],
  templateUrl: './sprint-board.component.html',
  styleUrls: ['./sprint-board.component.css'], // Corregido 'styleUrl' a 'styleUrls'
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SprintBoardComponent implements OnInit {
  private projectService = inject(ProjectService);
  readonly dialog = inject(MatDialog);

  // Datos del sprint seleccionado
  currentSprint: Sprint | null = null;
  selectedProject: Project|null = null;
  todo: Task[] = [];
  done: Task[] = [];
  needPlus3=0;
  description:string="";
  state:number = 0;
  goal: string="";
  sprintNumber:number=0;
  doneBacklog:Task[]=[];

  ngOnInit() {
    this.projectService.getSelectedProject().subscribe((project) => {
      this.selectedProject=project;
      if (project?.Sprints?.length) {
        const sortedSprints = [...project.Sprints].sort(
          (a, b) => b.Id - a.Id 
        );
        // Asignar el sprint más reciente
        this.currentSprint = sortedSprints[0];
        // Dividir las tareas en todo y done segun el estado
        // if (this.currentSprint.Tasks || this.selectedProject) {
        console.log(this.selectedProject?.ProductBacklog.Tasks)
          this.todo = this.selectedProject?.ProductBacklog?.Tasks??[];
          this.done = this.currentSprint?.Tasks?? [];
        // }
        this.description="aqui van los detalles de la tarea";//this.currentSprint.Description;
        this.goal=this.currentSprint.Goal;
        this.sprintNumber=this.currentSprint.Id;
      }
    });
  }
  changePlus3(value:number){
    this.needPlus3=value+3;
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
    console.log(this.selectedProject?.ProductBacklog?.Tasks)
    console.log(this.todo)
    if (this.currentSprint?.Tasks) {
      this.currentSprint.Tasks = this.done;
    }
  }

  openGeneralInformation() {
    const dialogRef = this.dialog.open(GeneralInformationComponent, { width: '70%' });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openAddTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, { width: '70%' });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
//ToDo: con el dragand drop los elementos se agregan pero de donde se tomaron no se eliminan

