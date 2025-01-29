import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Sprint } from '../entities/sprint.entity';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
  private selectedSprintSubject = new BehaviorSubject<Sprint | null>(null);

  getSelectedSprint(): Observable<Sprint | null> {
    return this.selectedSprintSubject.asObservable();
  }

  selectSprint(sprint: Sprint | null): void {
    this.selectedSprintSubject.next(sprint);
  }
}
