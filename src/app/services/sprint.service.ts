// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { Sprint } from '../entities/sprint.entity';

// @Injectable({
//   providedIn: 'root',
// })
// export class SprintService {
//   private selectedSprintSubject = new BehaviorSubject<Sprint | null>(null);

//   getSelectedSprint(): Observable<Sprint | null> {
//     return this.selectedSprintSubject.asObservable();
//   }

//   selectSprint(sprint: Sprint | null): void {
//     this.selectedSprintSubject.next(sprint);
//   }
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Sprint } from '../entities/sprint.entity';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
  private selectedSprintSubject = new BehaviorSubject<Sprint | null>(null);

  constructor(private http: HttpClient) {}

  getSelectedSprint(): Observable<Sprint | null> {
    return this.selectedSprintSubject.asObservable();
  }

  selectSprint(sprint: Sprint | null): void {
    this.selectedSprintSubject.next(sprint);
  }

  // Nuevo método para obtener sprints por id de proyecto
  getSprintsByProjectId(projectId: number): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`http://localhost:5038/Sprint/GetSprintsByProjectId?projectId=${projectId}`);
  }
}
