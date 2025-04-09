import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Task } from '../entities/Task.entity';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  constructor(private http: HttpClient) { }
  updateTasksState(userId: number, tasks: Task[]): Observable<boolean> {
    const url = 'http://localhost:5038/Task/UpdateTaksState/'+userId;
    return this.http.patch<boolean>(url, tasks)
      .pipe(
        catchError(err => {
          console.error("Error al actualizar los estados de las tareas:", err);
          return of(false);
        })
      );
  }
  updateTasksOrder(userId: number, tasks: Task[]): Observable<boolean>{
    const url = 'http://localhost:5038/Task/UpdateTaksOrder/'+userId;
    return this.http.patch<boolean>(url, tasks)
      .pipe(
        catchError(err => {
          console.error("Error al actualizar los estados de las tareas:", err);
          return of(false);
        } 
      )
      );
  }
  updateTasksSprint(payload: any): Observable<boolean> {
    const url = `http://localhost:5038/Task/UpdateTasksSprint`;
    return this.http.patch<boolean>(url, payload)
      .pipe(
        catchError(err => {
          console.error("Error al actualizar los estados de las tareas:", err);
          return of(false);
        })
      );
  }
  
}
