import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Sprint } from '../entities/sprint.entity';
import { HttpClient } from '@angular/common/http';
import { catchError, shareReplay, switchMap } from 'rxjs/operators';
import { ENVIRONMENT } from '../../enviroments/enviroment.prod';
import { ProjectService } from './project.service';
import { WeeklyScrum } from '../entities/weeklyscrum.entity';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
  private selectedSprintSubject = new BehaviorSubject<Sprint | null>(null);
  // private sprintsCache: { [projectId: number]: Observable<Sprint[]> } = {};

  constructor(private http: HttpClient, private projectService: ProjectService) {}

  getSelectedSprint(): Observable<Sprint | null> {
    return this.selectedSprintSubject.asObservable();
  }

  selectSprint(sprint: Sprint | null): void {
    this.selectedSprintSubject.next(sprint);
  }

  getSprintsByProjectId(projectId: number): Observable<Sprint[]> {
    // if (!this.sprintsCache[projectId]) {
      const url = `${ENVIRONMENT}Sprint/GetSprintsByProjectId?projectId=${projectId}`;
      // this.sprintsCache[projectId] = 
      return this.http.get<Sprint[]>(url)
        .pipe(
          catchError(err => {
            console.error("Error al obtener sprints:", err);
            return of([]); // Devuelve un array vacío en caso de error
          }),
          shareReplay(1)
        );
    // }
    // return this.sprintsCache[projectId];
  }
  

  getSprintById(sprintId: number): Observable<Sprint> {
    const url = `${ENVIRONMENT}Sprint/GetSprintBy/${sprintId}`;
    return this.http.get<Sprint>(url);
  }

  addSprint(projectId:number, sprintAdd: Sprint){
    const url = ENVIRONMENT+'Sprint/AddSprint/' + projectId;
    return of(null).pipe(
      switchMap(() => this.http.post<Sprint>(url, sprintAdd)),
      switchMap(response => {
        console.log('Sprint agregado:', response);
        // return response;
        return this.projectService.refreshProjectById(projectId);
      })
    );
  }
  
  getScrumWeeklyByTaskIds(taskIds: number[]){
    const url = `${ENVIRONMENT}Sprint/GetScrumsWeeklyByTaskIds`;    
    return this.http.post<WeeklyScrum[]>(url, taskIds)
  }

  updateStateSprint(sprintId: number){
    return this.http
      .patch<void>(
        `${ENVIRONMENT}Sprint/UpdateStateSprint/${sprintId}`,
        {}
      );
  }
  
}
