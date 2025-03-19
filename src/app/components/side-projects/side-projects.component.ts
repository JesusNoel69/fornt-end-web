//ToDo: cambiara a solo los proyectos relacionados con quien este logueado

import { Component, OnInit, OnDestroy, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Project } from '../../entities/project.entity';
import { Sprint } from '../../entities/sprint.entity';
import { ProjectService } from '../../services/project.service';
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-side-projects',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './side-projects.component.html',
  styleUrls: ['./side-projects.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush, // Opcional
})
export class SideProjectsComponent implements OnInit, OnDestroy {
  selectedProjectIndex: number = 0;
  projects: Project[] = [];
  private destroy$ = new Subject<void>();

  @Output() openDialog = new EventEmitter<void>();

  constructor(private projectService: ProjectService, private cdr: ChangeDetectorRef) {}

  openAddClick(): void {
    this.openDialog.emit();
  }

  ngOnInit(): void {
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
      .subscribe((selectedProject) => {
        if (selectedProject) {
          const index = this.projects.findIndex(
            (project) => project.Id === selectedProject.Id
          );
          this.selectedProjectIndex = index !== -1 ? index : 0;
          this.cdr.markForCheck();
        }
      });
  }

  selectProject(index: number): void {
    this.selectedProjectIndex = index;
    const selectedProject = this.projects[index];
    this.projectService.selectProject(selectedProject);
    this.cdr.markForCheck();
  }

  percentajeCompleted(sprints: Sprint[] | undefined): number {
    if (!sprints || sprints.length === 0) {
      return 0; // Si no hay sprints, retorna 0%
    }
  
    let completedCount = 0;
    sprints.forEach((element) => {
      if (element.State === 3) {
        completedCount++;
      }
    });
  
    return (completedCount / sprints.length) * 100;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
