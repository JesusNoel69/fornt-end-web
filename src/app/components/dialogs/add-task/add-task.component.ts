import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../entities/project.entity';
import { Task } from '../../../entities/Task.entity';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { Developer } from '../../../entities/developer.entity';
@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private project: Project | null = null;

  selectResponsable(developer: Developer): void {
    this.selectedResponsable = developer;
    console.log(this.selectedResponsable);
  }
  constructor(private projectService: ProjectService) {}

  states: number[] = [1, 2, 3, 4]; // Estados posibles
  currentState: number = 1;
  public taskName: string = '';
  public taskInformation: string = '';
  public taskWeeklyScrum: string = '';
  public selectedResponsable:Developer=null as any;
  public developers: Developer[]=[];

  ngOnInit() {
    this.projectService.getSelectedProject().subscribe((project) => {
      if (project) {
        this.project = project;
  
        const relatedTeam = this.project.TeamProject?.Teams.find(
          (team) => team.Id === this.project?.TeamProject?.TeamId
        );
  
        if (relatedTeam) {
          this.developers = relatedTeam.Developers;
        } else {
          console.warn('No se encontró un equipo relacionado con este proyecto.');
        }
      }
    });
  }
  

  setState(index: number): void {
    this.currentState = this.states[index];
  }
  getCircleClass(state: number): string {
    // console.log(state);
    switch (state) {
      case 1:
        return 'circle state-1';
      case 2:
        return 'circle state-2';
      case 3:
        return 'circle state-3';
      case 4:
        return 'circle state-4';
      default:
        return '';
    }
  }

  addTask() {
    if (!this.project) {
      console.warn('No hay un proyecto seleccionado.');
      return;
    }

    const newTaskId =
      this.project.ProductBacklog.Tasks.length > 0
        ? Math.max(...this.project.ProductBacklog.Tasks.map((task) => task.Id)) + 1
        : 1;

    const newTask: Task = {
      Id: newTaskId,
      Name: this.taskName,
      WeeklyScrum: this.taskWeeklyScrum,
      Description: this.taskInformation,
      State: this.currentState, // Usa el estado seleccionado
      ChangeDetails: [],
      Sprint: null as any,
      ProductBacklog: this.project.ProductBacklog,
      Responsible: this.selectedResponsable
    };

    // Agregar la tarea al backlog del proyecto
    this.project.ProductBacklog.Tasks.push(newTask);

    // Emitir el cambio al servicio
    this.projectService.updateSelectedProject(this.project);

    // Forzar la detección de cambios
    this.cdr.detectChanges();
    this.ngOnInit();

    console.log('Tarea añadida:', newTask);
  }
}
