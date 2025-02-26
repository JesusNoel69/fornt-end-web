import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Project } from '../entities/project.entity';
// import { projects } from '../mocks/project.mock';


@Injectable({
  providedIn: 'root',
})
//endpoint que traiga el proyecto de la db
export class ProjectService {
  private apiUrl:string ="http://localhost:5038/Project/GetProjects";
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  // private selectedProjectSubject = new BehaviorSubject<Project | null>(
  //   projects.length > 0 ? projects[0] : null
  // );
  private selectedProjectSubject = new BehaviorSubject<Project | null>(null);

  constructor(private http: HttpClient ) {
    this.loadProjects();
  }
  private loadProjects(): void {
    this.http.get<Project[]>(`${this.apiUrl}`).subscribe((projects) => {
      this.projectsSubject.next(projects);
      // console.log(projects)
      if (projects?.length > 0) {
        this.selectedProjectSubject.next(projects[0]); // Selecciona el primer proyecto
      }
    });
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

    // Actualizar el proyecto seleccionado si la lista de proyectos cambia
    if (projects.length > 0 && !this.selectedProjectSubject.value) {
      this.selectedProjectSubject.next(projects[0]);
    }
  }

  // metodo para actualizar el proyecto seleccionado
  updateSelectedProject(updatedProject: Project): void {
    // Emitir el proyecto actualizado
    this.selectedProjectSubject.next(updatedProject);

    // actualizar la lista de proyectos si es necesario
    const allProjects = this.projectsSubject.getValue();
    const index = allProjects.findIndex((p) => p.Id === updatedProject.Id);
    if (index !== -1) {
      allProjects[index] = updatedProject;
      this.projectsSubject.next([...allProjects]);
    }
  }
  // addProject(newProject: Project): Observable<Project> {
  //   return this.http.post<Project>(
  //     'http://localhost:5038/Project/InsertProject', 
  //     newProject
  //   );
  // }
// ...
addProject(newProject: Project): Observable<Project> {
  return this.http.post<Project>('http://localhost:5038/Project/InsertProject', newProject)
    .pipe(
      tap((insertedProject: Project) => {
        const currentProjects = this.projectsSubject.getValue();
        // Se agrega el proyecto insertado a la lista
        this.projectsSubject.next([...currentProjects, insertedProject]);
      })
    );
}

}
