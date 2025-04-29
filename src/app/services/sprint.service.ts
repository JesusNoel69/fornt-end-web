import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Sprint } from '../entities/sprint.entity';
import { HttpClient } from '@angular/common/http';
import { catchError, shareReplay } from 'rxjs/operators';
import { ENVIROMENT } from '../../enviroments/enviroment.prod';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
  private selectedSprintSubject = new BehaviorSubject<Sprint | null>(null);
  // private sprintsCache: { [projectId: number]: Observable<Sprint[]> } = {};

  constructor(private http: HttpClient) {}

  getSelectedSprint(): Observable<Sprint | null> {
    return this.selectedSprintSubject.asObservable();
  }

  selectSprint(sprint: Sprint | null): void {
    this.selectedSprintSubject.next(sprint);
  }

  getSprintsByProjectId(projectId: number): Observable<Sprint[]> {
    // if (!this.sprintsCache[projectId]) {
      const url = `${ENVIROMENT}Sprint/GetSprintsByProjectId?projectId=${projectId}`;
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
    const url = `${ENVIROMENT}Sprint/GetSprintBy/${sprintId}`;
    return this.http.get<Sprint>(url);
  }
  
}
