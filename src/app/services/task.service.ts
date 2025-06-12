import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, Observable, of } from 'rxjs';
import { Task } from '../entities/Task.entity';
import { ENVIRONMENT } from '../../enviroments/enviroment.prod';
import { TaskCreateDto } from '../dtos/taskcreate.dto';
import { BodyTaskScrum } from '../dtos/bodytaskscrum.dto';
import { Sprint } from '../entities/sprint.entity';
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
    const url = ENVIRONMENT+'Task/UpdateTaksState/'+userId;
    return this.http.patch<boolean>(url, tasks)
      .pipe(
        catchError(err => {
          console.error("Error al actualizar los estados de las tareas:", err);
          return of(false);
        })
      );
  }
  deleteTaskById(id: number){
    return this.http.delete<void>(`${ENVIRONMENT}Task/DeleteTaskById`, {
      params: { id: id }
    });
  }
  updateTasksOrder(userId: number, tasks: Task[]): Observable<boolean>{
    const url = ENVIRONMENT+'Task/UpdateTaksOrder/'+userId;
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
    const url = `${ENVIRONMENT}Task/UpdateTasksSprint`;
    return this.http.patch<boolean>(url, payload)
      .pipe(
        catchError(err => {
          console.error("Error al actualizar los estados de las tareas:", err);
          return of(false);
        })
      );
  }
  updateTask(dataTask: UpdateTaskDTO): Observable<void> {
    const url = `${ENVIRONMENT}Task/UpdateTask`;
    return this.http.post<void>(url, dataTask);
  }

  async addTaskToProductBacklog(newTask: TaskCreateDto){
     const apiUrl = ENVIRONMENT+'Task/AddTaskToProductBacklog';
        try {
          const addedTask = await firstValueFrom(this.http.post<TaskCreateDto>(apiUrl, newTask));
          console.log("Tarea agregada:", addedTask);
          if(addedTask!=null)
            return true;
          return false;
        } catch (error) {
          console.error("Error al agregar la tarea o actualizar el backlog:", error);
          return false;
        }
  }
  
  getTasksBySprintId(sprintId: number){
    const url = `${ENVIRONMENT}Task/GetTasksBySprintId/${sprintId}`;
    return this.http.get<Task[]>(url)
  } 
  
  getTasksByDeveloperId(userId: number){
    return this.http.get<Task[]>(`${ENVIRONMENT}Task/GetTasksByDeveloperId/${userId}`)
  }

  AddTaskByDeveloperId(body: BodyTaskScrum){
    return this.http.post<boolean>(ENVIRONMENT+'Task/AddScrumWeeklyToTask', body)
  }

   async progressValue(sprint: Sprint): Promise<number> {
    console.log("Obteniendo progreso de sprint:", sprint);
    try {
      return await firstValueFrom(
        this.http.get<number>(`${ENVIRONMENT}Task/GetProgressvalue?sprintId=${sprint.Id}`)
      );
    } catch (error) {
      console.error("Error obteniendo progreso:", error);
      return 0; // En caso de error, devolvemos 0
    }
  }
}
