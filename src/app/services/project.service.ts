import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../entities/project.entity';
import { projects } from '../mocks/project.mock';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectsSubject = new BehaviorSubject<Project[]>(projects);
  private selectedProjectSubject = new BehaviorSubject<Project | null>(
    projects.length > 0 ? projects[0] : null
  );

  constructor() {}

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

  addProject(newProject: Project): void {
    const allProjects = this.projectsSubject.getValue();
    newProject.Id = allProjects.length > 0 ? Math.max(...allProjects.map(p => p.Id)) + 1 : 1;
    this.projectsSubject.next([...allProjects, newProject]);
    this.selectProject(newProject);
  }
}
