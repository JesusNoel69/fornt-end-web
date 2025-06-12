import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
// import { MatTableModule } from '@angular/material/table';
import { Sprint } from '../../../../../src/app/entities/sprint.entity';
import { WeeklyScrum } from '../../../../../src/app/entities/weeklyscrum.entity';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../../entities/Task.entity';
import { Developer } from '../../../entities/developer.entity';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user.service';
import {  MatMenuModule } from '@angular/material/menu';
import {  MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
// import { ENVIRONMENT } from '../../../../enviroments/enviroment.prod';
import { SprintService } from '../../../services/sprint.service';
import { TaskService } from '../../../services/task.service';
import { BodyTaskScrum } from '../../../dtos/bodytaskscrum.dto';


interface DeveloperTask {
  DeveloperName: string;
  TaskId: number;
}

@Component({
  selector: 'app-general-information',
  standalone: true,
  imports: [MatDialogModule, FormsModule ,MatCardModule, MatButtonModule, CommonModule, MatDivider, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.css',
})
export class GeneralInformationComponent implements OnChanges, OnInit {
  sprint: Sprint;
  columns: { initials: string; color: string; content: string }[] = [];
  tasks: Task[]=[];
  content: string ="";
  tasksDeveloper : Task[]=[];
  scrums: WeeklyScrum[] = []; // Añadido para almacenar los scrums
  developers:  Developer[]=[];
  selectedTask?: Task;
  userId!: number;
  userRol!: boolean;
  private destroy$ = new Subject<void>();


  constructor(@Inject(MAT_DIALOG_DATA) public data: { sprint: Sprint }, private http: HttpClient, private userService: UserService, private cdr: ChangeDetectorRef,  private taskService: TaskService, private sprintService: SprintService) {
    this.sprint = data.sprint;
    console.log("sprint",this.sprint);
    this.taskService.getTasksBySprintId(this.sprint.Id).subscribe({
      next: (tasks: Task[]) => {
        this.tasks=tasks;
        console.log("es:",this.tasks);
        this.fetchScrumsByTaskIds();
      },
      error: (err) => {
        console.error("Error al obtener tareas del sprint:", err);
      }
    });
  }

  ngOnInit(){
    this.userService.userId$.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      this.userId = id;
      console.log("el usuario es", this.userId)
      this.taskService.getTasksByDeveloperId(this.userId).subscribe({
        next: (tasks) => {
          this.tasksDeveloper = tasks;
          console.log('Tasks recibidas:', this.tasksDeveloper);
        },
        error: (err) => {
          console.error('Error al obtener las tasks', err);
        }
      });

    });
    this.userService.userRol$.pipe(takeUntil(this.destroy$)).subscribe((rol) => {
      this.userRol = rol;
      this.cdr.markForCheck();
    });
  }

  selectTask(task: Task): void {
    this.selectedTask = task;
  }
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sprint']) {
      this.generateScrumData();
    }
  }
  private fetchScrumsByTaskIds(): void {
    const taskIds = this.tasks.map(task => task.Id);
    console.log("las tareas son: ",taskIds);
    // Llamada al endpoint para obtener los scrums, enviando taskIds en el cuerpo como JSON
    // const url = `${ENVIRONMENT}Sprint/GetScrumsWeeklyByTaskIds`;    
    // this.http.post<WeeklyScrum[]>(url, taskIds)
  this.sprintService.getScrumWeeklyByTaskIds(taskIds)
    .subscribe({
      next: (scrums: WeeklyScrum[]) => {
        this.scrums = scrums;
        let ids = this.scrums.map(dev=>dev.DeveloperId);
        this.FetchDevelopersByIds(ids);
        console.log("Scrums obtenidos:", this.scrums);
        // this.generateScrumData();
      },
      error: (err) => {
        console.error("Error al obtener scrums:", err);
      }
    });
  }
  addScrumWeeklyToTask(): void {
    // developerId: number, content: string, taskId: number
    const body: BodyTaskScrum = { DeveloperId:this.userId, Content:this.content, TaskId:this.selectedTask?.Id };
    console.log(body);
    // this.http.post<boolean>(ENVIRONMENT+'Task/AddScrumWeeklyToTask', body)
    this.taskService.AddTaskByDeveloperId(body).subscribe({
      next: (response: boolean) => {
        console.log(response);
      },
      error: (err) => {
        console.error('Error al insertar scrum semanal', err);
      }
    });
  }
  
  private FetchDevelopersByIds(ids: number[]){
    console.log("Los ids son: ", ids)
    // this.http.post<Developer[]>(`${ENVIRONMENT}User/GetDevelopersByIds`, ids)
      this.userService.getDevelopersByIds(ids).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (developers: Developer[]) => {
          console.log('Desarrolladores obtenidos:', developers);
          
          // Guardar la respuesta en `devs`
          this.developers= developers;///.map(dev => [dev.DeveloperName, dev.TaskId]);
          this.generateScrumData();
          console.log('Lista de desarrolladores y tareas:', this.developers);
        },
        error: (err) => {
          console.error('Error al obtener desarrolladores:', err);
        }
      });
  }

  private generateScrumData(): void {
    // Verifica que tengamos scrums disponibles
    if (!this.scrums || this.scrums.length === 0) {
      this.columns = [];
      return;
    }
    const colors = ['#E57373', '#9575CD', '#4DD0E1', '#81C784', '#FFF176'];
    // Mapea los scrums para crear las columnas
    console.log(this.scrums);
    this.columns = this.scrums.map((scrum, index) => {
      // Usamos "Information" para la columna
      console.log(scrum.DeveloperId+"  l"+this.developers);
      const developer = this.developers.find(x => x.Id === scrum.DeveloperId);
      const developerName = developer?.Name || "Anónimo";
      

      const initials = developerName
        .split(' ')
        .map(n => n.charAt(0))
        .join('')
        .toUpperCase();

      return {
        initials: initials.length > 1 ? initials : initials + initials, // Garantiza que haya al menos dos iniciales
        color: colors[index % colors.length], // Asigna colores cíclicamente
        content: scrum.Information, // El contenido será la información del Scrum
        createdAt: scrum.CreatedAt // También puedes agregar la fecha de creación si lo necesitas
      };
    });

    console.log("Columnas generadas:", this.columns);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}