import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, Observable, tap } from 'rxjs';
import { Project } from '../entities/project.entity';
import { ProductBacklog } from '../entities/productbacklog.entity';
import { Developer } from '../entities/developer.entity';
import { Task } from '../entities/Task.entity';
import { UserService } from './user.service';
import { ENVIRONMENT } from "../../enviroments/enviroment.prod";
import { ChangeDetailWithTaskNameDto } from '../dtos/changedetailwithtaskname.dto';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl: string = ENVIRONMENT+"Project/GetProjects";
  
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  private selectedProjectSubject = new BehaviorSubject<Project | null>(null);

  // BehaviorSubject para las tareas del sprint actual
  private sprintTasksSubject = new BehaviorSubject<Task[]>([]);
  // Objeto para marcar si ya se han cargado las tareas para un sprint dado (clave: sprintId)
  private sprintTasksLoaded: { [sprintId: number]: boolean } = {};

  constructor(private http: HttpClient, private user: UserService) {
    // Suscribirse a los cambios en userId y userRol
    combineLatest([this.user.userId$, this.user.userRol$]).subscribe(
      ([userId, userRol]) => {
        // Solo carga si el userId ya fue actualizado (distinto de 0)
        console.log("User ID recibido:", userId);
        console.log("User Role recibido:", userRol);
        if (userId !== 0) {
          this.loadProjects(userId, userRol);
        }
      }
    );
  }

  getProjectById(id: number): Observable<Project> {
    const url = `${ENVIRONMENT}Project/GetProjectById/${id}`;
    return this.http.get<Project>(url)
      .pipe(
        tap(project => {
          console.log("Proyecto obtenido:", project);
        }),
        catchError(err => {
          console.error("Error al obtener el proyecto:", err);
          throw err;
        })
      );
  }

  refreshProjectById(projectId: number): Observable<Project> {
    const url = `${ENVIRONMENT}Project/GetProjectById/${projectId}`;
    return this.http.get<Project>(url).pipe(
      tap((project) => {
        this.selectedProjectSubject.next(project);
      }),
      catchError(err => {
        console.error("Error refrescando el proyecto:", err);
        throw err;
      })
    );
  }
//  http://localhost:5038/Project/GetProjects?userId=48&role=true
  private loadProjects(userId: number, userRol: boolean): void {
    const url = `${this.apiUrl}?userId=${userId}&role=${userRol}`;
    console.log("url generada: ", url)
    this.http.get<Project[]>(url).subscribe({
      next: (projects) => {
        const projectsArray = Array.isArray(projects) ? projects : [];
        this.projectsSubject.next(projectsArray);
        this.selectedProjectSubject.next(
          projectsArray.length > 0 ? projectsArray[0] : null
        );
      },
      error: (err) => {
        console.error("Error al obtener proyectos:", err);
        this.projectsSubject.next([]);
        this.selectedProjectSubject.next(null);
      }
    });
  }
  
  getProductBacklogById(projectId: number): Observable<ProductBacklog> {
    console.log("productbacklogID: " + projectId);
    const url = `${ENVIRONMENT}Project/GetProductBacklogById/${projectId}`;
    return this.http.get<ProductBacklog>(url);
  }
  
  getProjects(): Observable<Project[]> {
    return this.projectsSubject.asObservable();
  }

  getSelectedProject(): Observable<Project | null> {
    return this.selectedProjectSubject.asObservable();
  }

  selectProject(project: Project): void {
    this.selectedProjectSubject.next(project);
  }

  updateProjects(projects: Project[]): void {
    this.projectsSubject.next(projects);
    if (projects.length > 0 && !this.selectedProjectSubject.value) {
      this.selectedProjectSubject.next(projects[0]);
    }
  }
  
  updateSelectedProject(updatedProject: Project): void {
    const allProjects = this.projectsSubject.getValue();
    const index = allProjects.findIndex((p) => p.Id === updatedProject.Id);
    if (index !== -1) {
      allProjects[index] = updatedProject;
      this.projectsSubject.next([...allProjects]);
    }
    
    this.selectedProjectSubject.next({ ...updatedProject, Sprints: updatedProject.Sprints || [] });
  }
  

  getTeamProjectsByProjectId(projectId: number): Observable<Developer[]> {
    const url = `${ENVIRONMENT}User/GetDevelopersByProjectId/${projectId}`;
    return this.http.get<Developer[]>(url);
  }

  addProject(newProject: Project, userId: number): Observable<Project> {
    return this.http.post<Project>(ENVIRONMENT+'Project/InsertProject', { project: newProject, userId: userId })
      .pipe(
        tap((insertedProject: Project) => {
          const currentProjects = this.projectsSubject.getValue();
          this.projectsSubject.next([...currentProjects, insertedProject]);
        })
      );
  }
  

  
  updateSprintTasks(sprintId: number): void {
    // Si ya se han cargado las tareas para este sprint, no se vuelve a llamar
    if (this.sprintTasksLoaded[sprintId]) {
      return;
    }

    const url = `${ENVIRONMENT}Task/GetTasksBySprintId/${sprintId}`;
    this.http.get<Task[]>(url).subscribe({
      next: (tasks: Task[]) => {
        this.sprintTasksLoaded[sprintId] = true; // Marcamos que ya se cargaron las tareas para este sprint
        this.sprintTasksSubject.next(tasks);
      },
      error: (err) => {
        console.error("Error al obtener tareas del sprint:", err);
        this.sprintTasksSubject.next([]);
      }
    });
  }
  // Observable para que otros componentes se suscriban a las tareas del sprint
  getSprintTasks(): Observable<Task[]> {
    return this.sprintTasksSubject.asObservable();
  }

  getChangeDetailsWithTaskName(projectId:number): Observable<ChangeDetailWithTaskNameDto[]>{
    const url = `${ENVIRONMENT}ChangeDetails/GetChangeDetailsByProjectId/${projectId}`;
    return this.http.get<ChangeDetailWithTaskNameDto[]>(url);
  }
}
