import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
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
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { ENVIROMENT } from '../../../../enviroments/enviroment.prod';

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
  // porductOwnerIdFutureService:number=50;
  userId!: number;
  userRol!: boolean;
  private destroy$ = new Subject<void>();
  constructor(private projectService: ProjectService, private cdr: ChangeDetectorRef, private http: HttpClient, private userService: UserService) {}

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

  ngOnInit() {

    this.userService.userId$.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      this.userId = id;
      // this.loadProjects(); // Recargar proyectos al cambiar el usuario

    });

    this.userService.userRol$.pipe(takeUntil(this.destroy$)).subscribe((rol) => {
      this.userRol = rol;
      this.cdr.markForCheck();
    });

    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
    const url = `${ENVIROMENT}User/GetTeamsByProductOwnerId/${this.userId}`;
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
    const url = `${ENVIROMENT}User/GetDeveloperByTeamId/${id}`;
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
      Responsible: null as any,
      Order:0
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
    this.projectService.addProject(newProject, this.userId).subscribe({
      next: (response) => {
        console.log("Proyecto agregado con éxito:", response);
        this.projectService.getProjects().subscribe({
          next: (response_r)=>{
            this.projects=response_r;
            
          }
        })
      },
      error: (error) => {
        console.error("Error al agregar proyecto:", error);
      }
    });
    console.log(newProject)
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  cancel(){

  }
}