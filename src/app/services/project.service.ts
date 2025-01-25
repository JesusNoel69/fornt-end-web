import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../entities/project.entity';
import { projects } from '../mocks/project.mock';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectsSubject = new BehaviorSubject<Project[]>(projects);
  private selectedProjectSubject = new BehaviorSubject<Project | null>(null);

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
  }
}
