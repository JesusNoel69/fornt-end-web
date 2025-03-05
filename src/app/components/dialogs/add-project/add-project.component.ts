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
import { Team } from '../../../entities/team.entity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  teams: Team[]=[];
  selectedTeam:Team=null as any;
  //debo cambiarlo a una sesion usando el login
  porductOwnerIdFutureService:number=43;

  constructor(private projectService: ProjectService, private http: HttpClient) {}

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
    TeamProjects: [
      {
        TeamId: 0,
        ProjectId: 0 // Opcional, se asignará en el backend
      }
    ],
    ProductBacklog: {
      Id: 0,
      UpdateAt: new Date(),
      Comment: '',
      UpdatedBy: '',
      Project: null!,
      Tasks: []
    }
  };
  
  developers: Developer[] = [];
  // Developer[] = [
  //   {
  //     Id: 1,
  //     Rol: false,
  //     Name: 'John Smith',
  //     Account: 'john.smith',
  //     Password: 'password123',
  //     NameSpecialization: 'Frontend Developer',
  //     Team: null,
  //     WeeklyScrum: null,
  //     ProductOwner: null as any,
  //     Developer: null as any,
  //     ChangeDetails: null as any,
  //   },
  //   {
  //     Id: 2,
  //     Rol: false,
  //     Name: 'Emily Clark',
  //     Account: 'emily.clark',
  //     Password: 'password456',
  //     NameSpecialization: 'Backend Developer',
  //     Team: null,
  //     WeeklyScrum: null,
  //     ProductOwner: null as any,
  //     Developer: null as any,
  //     ChangeDetails: null as any,
  //   },
  // ];

  ngOnInit() {
   
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
    const url = `http://localhost:5038/User/GetTeamsByProductOwnerId/${this.porductOwnerIdFutureService}`;
    this.http.get<Team[]>(url).subscribe({
      next: (data) => {
        this.teams = data;
        console.log('Teams recibidos:', this.teams);
      },
      error: (err) => {
        console.error('Error al obtener los teams:', err);
      }
    });

  }
  getDevelopers(id:number){
    const url = `http://localhost:5038/User/GetDeveloperByTeamId/${id}`;
    this.http.get<Developer[]>(url).subscribe({
      next: (data) => {
        this.developers = data;
        console.log('Desarrolladores recibidos:', this.developers);
      },
      error: (err) => {
        console.error('Error al obtener los desarrolladores:', err);
      }
    });
  }

  selectTeam(team: Team): void {
    this.selectedTeam = team;
    console.log('Equipo seleccionado:', this.selectedTeam);
    this.getDevelopers(team.Id);
    // Aquí puedes asignar selectedTeam a la propiedad correspondiente del proyecto.
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
    const projectCount = this.projects ? this.projects.length : 0;
  
    // Preparamos las tareas para que sean nuevas (Id = 0)
    const newTasks = this.project.ProductBacklog.Tasks.map(task => ({
      ...task,
      Id: 0
    }));
  
    const newProject: Project = {
      Id: 0,
      StartDate: new Date(),
      State: this.projectState,
      Repository: this.repository,
      ServerImage: this.server,
      ProjectNumber: projectCount + 1,
      Sprints: [
        {
          Id: 0,
          ChangeDetails: [],
          Description: this.descriptionSprint,
          Goal: this.goalSprint,
          Project: null as any,
          Tasks: newTasks,
          ProjectNumber: projectCount + 1,
          State: 1,
          Repository: this.repository,
          StartDate: new Date(),
          EndDate: this.endDate || new Date(),
        },
      ],
      TeamProjects: [
        {
          TeamId: this.selectedTeam.Id,
          ProjectId: 0 // Opcional, se asignará en el backend
        }
      ],
      ProductBacklog: {
        Id: 0,
        UpdateAt: new Date(),
        Comment: '',
        UpdatedBy: '',
        Project: null!,
        Tasks: []
      }
    };
    
  
    console.log('Proyecto confirmado:', newProject);
    this.projectService.addProject(newProject).subscribe({
      next: (response) => {
        console.log("Proyecto agregado con éxito:", response);
      },
      error: (error) => {
        console.error("Error al agregar proyecto:", error);
      }
    });
    console.log(newProject)
  }
  
  
  cancel(){

  }
}