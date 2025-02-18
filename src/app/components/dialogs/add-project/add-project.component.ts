import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { Task } from '../../../entities/Task.entity';
import { Project } from '../../../entities/project.entity';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Developer } from '../../../entities/developer.entity';
import { ProjectService } from '../../../services/project.service';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-add-project',
  standalone: true,
    providers: [provideNativeDateAdapter()],
  imports: [MatCard, MatCardModule, MatLabel, ReactiveFormsModule, FormsModule, MatDialogModule, MatButtonModule, MatLabel, CommonModule,
        MatIconModule,
        MatMenuModule,
        MatFormField, MatHint,MatDatepickerModule, MatInputModule, MatFormFieldModule
  ],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {
  tasks: Task[]=[];
  descriptionSprint:string="";
  goalSprint:string="";
  projects: Project[]=[];
  responsible: string = '';
  states: number[] = [1, 2, 3, 4]; // Los posibles estados del proyecto
  projectState: number = 1;
  taskWeeklyScrum: any;
  taskInformation: any;
  taskName: any;
  repository: string="";
  server: string="";
  endDate:Date=null as any;

  constructor(private projectService: ProjectService) {}

  project: Project = {
    Id: 0,
    StartDate: new Date(),
    State: 1,
    Repository: this.repository,
    ServerImage: this.server,
    ProjectNumber: 0,
    Sprints: [{
      ChangeDetails: [],
      Description:this.descriptionSprint,
      Goal: this.goalSprint,
      Id:0,
      Project: null as any,
      Tasks:[],
      ProjectNumber:0,
      State:1,
      Repository:this.repository,
      StartDate: new Date(),
      EndDate: new Date()
    }],
    TeamProject: {
      TeamId: 0,
      ProjectId: 0,
      Teams: [],
      Projects: []
    },
    ProductBacklog: {
      Id: 0,
      UpdateAt: new Date(),
      Comment: '',
      UpdatedBy: '',
      Project: null!,
      Tasks: []
    }
  };
  
  developers: Developer[] = [
    {
      Id: 1,
      Rol: false,
      Name: 'John Smith',
      Account: 'john.smith',
      Password: 'password123',
      NameSpecialization: 'Frontend Developer',
      Team: null,
      WeeklyScrum: null,
      ProductOwner: null as any,
      Developer: null as any,
      ChangeDetails: null as any,
    },
    {
      Id: 2,
      Rol: false,
      Name: 'Emily Clark',
      Account: 'emily.clark',
      Password: 'password456',
      NameSpecialization: 'Backend Developer',
      Team: null,
      WeeklyScrum: null,
      ProductOwner: null as any,
      Developer: null as any,
      ChangeDetails: null as any,
    },
  ];

  ngOnInit() {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }




  addTask(): void {
    this.project.ProductBacklog.Tasks.push({
      Id: this.project.ProductBacklog.Tasks.length + 1,
      Name: '',
      WeeklyScrum: '',
      Description: '',
      State: 1,
      ChangeDetails: [],
      Sprint: null!,
      ProductBacklog: null!,
      Responsible: null as any
    });
  }

  getCircleClass(state: number): string {
    // console.log(state);
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

  setTaskState(task: Task, state: number): void {
    task.State = state;
  }


  setProjectState(state: number): void {
    this.project.State = state;
  }
  selectResponsable(task: Task, developer: Developer): void {
    task.Responsible = developer;
  }
  confirm() {
    const newProject: Project = {
      Id: 0,
      StartDate: new Date(),
      State: this.projectState,
      Repository: this.repository,
      ServerImage: this.server,
      ProjectNumber: this.projects.length + 1,
      Sprints: [
        {
          Id: 0,
          ChangeDetails: [],
          Description: this.descriptionSprint,
          Goal: this.goalSprint,
          Project: null as any,
          Tasks: [...this.project.ProductBacklog.Tasks], // Clona las tareas actuales
          ProjectNumber: this.projects.length + 1,
          State: 1,
          Repository: this.repository,
          StartDate: new Date(),
          EndDate: this.endDate || new Date(),
        },
      ],
      TeamProject: {
        TeamId: 0,
        ProjectId: 0,
        Teams: [],
        Projects: [],
      },
      ProductBacklog: {
        Id: 0,
        UpdateAt: new Date(),
        Comment: '',
        UpdatedBy: '',
        Project: null!,
        Tasks: [...this.project.ProductBacklog.Tasks],
      },
    };
    console.log('Proyecto confirmado:', newProject);
  this.projectService.addProject(newProject);
  }  
  cancel(){

  }
}