import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Task } from '../entities/Task.entity';
import { ENVIROMENT } from '../../enviroments/enviroment.prod';
interface UpdateTaskDTO{
  Task: Task,
  UserId?: number
}
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  constructor(private http: HttpClient) { }
  updateTasksState(userId: number, tasks: Task[]): Observable<boolean> {
    const url = ENVIROMENT+'Task/UpdateTaksState/'+userId;
    return this.http.patch<boolean>(url, tasks)
      .pipe(
        catchError(err => {
          console.error("Error al actualizar los estados de las tareas:", err);
          return of(false);
        })
      );
  }
  deleteTaskById(id: number){
    return this.http.delete<void>(`${ENVIROMENT}Task/DeleteTaskById`, {
      params: { id: id }
    });
  }
  updateTasksOrder(userId: number, tasks: Task[]): Observable<boolean>{
    const url = ENVIROMENT+'Task/UpdateTaksOrder/'+userId;
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
    const url = `${ENVIROMENT}Task/UpdateTasksSprint`;
    return this.http.patch<boolean>(url, payload)
      .pipe(
        catchError(err => {
          console.error("Error al actualizar los estados de las tareas:", err);
          return of(false);
        })
      );
  }
  updateTask(dataTask: UpdateTaskDTO): Observable<void> {
    const url = `${ENVIROMENT}Task/UpdateTask`;
    return this.http.post<void>(url, dataTask);
  }
  
}
