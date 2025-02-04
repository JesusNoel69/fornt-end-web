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

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Project } from '../../../entities/project.entity';
import { ProjectService } from '../../../services/project.service';
import { Task } from '../../../entities/Task.entity';
import { Sprint } from '../../../entities/sprint.entity';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-sprint',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, CdkDrag, CdkDropList, MatTableModule, MatButtonModule, MatIconModule, MatDivider,
     MatDialogModule, CommonModule, FormsModule,MatFormFieldModule, MatInputModule, MatDatepickerModule
   ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-sprint.component.html',
  styleUrl: './add-sprint.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSprintComponent implements OnInit{
  selectedProject: Project | null = null;
  private projectService = inject(ProjectService);
  ngOnInit(): void {
    this.projectService.getSelectedProject().subscribe((project)=>{
      this.selectedProject = project,
      this.todo = project?.ProductBacklog?.Tasks ?? [],
      this.done = [];
    });
  }
  todo:Task[] = [];
  done: Task[] = [];
  goal:string="";
  description:string="";
  name: string="";

  date: Date|null = null;
  needPlus3: number=5;
  sprintToAdd: Sprint | null = null;
  changePlus3(value:number){
    this.needPlus3=value+3;
  }
  deleteFields():void{
    this.todo = [];
    this.done = [];
    this.goal="";
    this.name="";
    this.date= null;
    this.needPlus3=5;
    this.sprintToAdd = null;
  }
  addSprint():void{
    if (this.selectedProject?.ProductBacklog?.Tasks) {
      this.selectedProject.ProductBacklog.Tasks = this.todo;
      let sprintToAdd: Sprint = {
        Project: this.selectedProject,
        Tasks: this.done,
        Goal: this.goal,
        Id: 0, //autoincremental en db
        StartDate: new Date(Date.now()),
        EndDate: this.date??new Date,
        Description: this.description,
        State: 0,//por hacer
        Repository: this.selectedProject?.Repository,
        ProjectNumber: this.selectedProject?.ProjectNumber, //deberia ser autoincremental en la db, revisar
        ChangeDetails: []
      }
      console.log(sprintToAdd);
      this.selectedProject.Sprints.push(sprintToAdd)
      console.log(this.selectedProject.Sprints)
      console.log(this.selectedProject.ProductBacklog)
    }
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
    console.log('Tareas en todo:', this.todo);
    console.log('Tareas en done:', this.done);
  }
  
}
