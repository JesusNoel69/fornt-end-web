//ToDo: cambiara a solo los proyectos relacionados con quien este logueado

import { Component, OnInit, OnDestroy, ChangeDetectorRef, EventEmitter, Output, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Project } from '../../entities/project.entity';
import { Sprint } from '../../entities/sprint.entity';
import { ProjectService } from '../../services/project.service';
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SprintService } from '../../services/sprint.service';

@Component({
  selector: 'app-side-projects',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatProgressBarModule, MatIconModule, MatMenuModule, MatSidenavModule, FormsModule, CommonModule],
  templateUrl: './side-projects.component.html',
  styleUrls: ['./side-projects.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush, // Opcional
})
export class SideProjectsComponent implements OnInit, OnDestroy {
  selectedProjectIndex: number = 0;
  projects: Project[] = [];
  userId!: number; 
  userRol!: boolean;
  private destroy$ = new Subject<void>();
  sprints: Sprint[] = [];

  @Output() openDialog = new EventEmitter<void>();

  constructor(private projectService: ProjectService, private cdr: ChangeDetectorRef, private userService: UserService, private bo: BreakpointObserver, private sprintService: SprintService) {}

  openAddClick(): void {
    this.openDialog.emit();
  }

  isSmallScreen(): boolean {
    return this.bo.isMatched('(max-width: 767px)');
  }

  ngOnInit(): void {
    this.userService.userId$.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      console.log(id)
      this.userId = id;
      // this.loadProjects(); // Recargar proyectos al cambiar el usuario
    });

    this.userService.userRol$.pipe(takeUntil(this.destroy$)).subscribe((rol) => {
      this.userRol = rol;
      this.cdr.markForCheck();
    });

    // Suscribirse a la lista de proyectos
    this.projectService.getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe((projects) => {
        this.projects = projects.sort((a, b) => b.Id - a.Id);;
        this.cdr.markForCheck();
      });

    // Suscribirse al proyecto seleccionado para actualizar el índice
    this.projectService.getSelectedProject()
    .pipe(takeUntil(this.destroy$))
    .subscribe(selectedProject => {
      if (!selectedProject) return;
  
      // Encuentra el índice y el proyecto seleccionado
      const idx = this.projects.findIndex(p => p.Id === selectedProject.Id);
      this.selectedProjectIndex = idx !== -1 ? idx : 0;
  
      // Ahora sí, llama con el ID correcto
      const projId = this.projects[this.selectedProjectIndex].Id;
      this.sprintService.getSprintsByProjectId(projId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: Sprint[]) => {
            this.sprints = data;
            this.cdr.markForCheck();
          },
          error: (err: any) => console.error('Error cargando sprints:', err)
        });
    });
  
  }

  nextProject() {
    if (this.selectedProjectIndex < this.projects.length - 1) {
      this.selectedProjectIndex++;
    }
  }

  /* Volver al anterior (si existe) */
  prevProject() {
    if (this.selectedProjectIndex > 0) {
      this.selectedProjectIndex--;
    }
  }
  
  selectProject(index: number): void {
    this.selectedProjectIndex = index;
    const selectedProject = this.projects[index];
    this.projectService.selectProject(selectedProject);
    this.cdr.markForCheck();
  }

  percentageCompleted(sprints: Sprint[] | undefined): number {
    // console.log(this.projects)
    if (!this.sprints || this.sprints.length === 0) {
      return 0; // Si no hay sprints, retorna 0%
    }
  
    let completedCount = 0;
    this.sprints.forEach((element) => {
      if (element.State === 1) {
        completedCount++;
      }
    });
    // 'Http failure response for http://localhost:5038/Integrations/UpdateStateSprint/53: 404 Not Found'
  
    return (completedCount / this.sprints.length) * 100;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
