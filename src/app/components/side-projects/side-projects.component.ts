// import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { Project } from '../../entities/project.entity';
// import { Sprint } from '../../entities/sprint.entity';
// import { ProjectService } from '../../services/project.service';

// @Component({
//   selector: 'app-side-projects',
//   standalone: true,
//   imports: [MatButtonModule, MatCardModule, MatProgressBarModule],
//   templateUrl: './side-projects.component.html',
//   styleUrl: './side-projects.component.css',
//   // changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class SideProjectsComponent implements OnInit {
//   selectedProjectIndex: number = 0;
//   projects: Project[] = [];

//   constructor(private projectService: ProjectService, private cdr: ChangeDetectorRef) {

//   }
//   ///
//   @Output() openDialog = new EventEmitter<void>();

//   openAddClick() {
//     this.openDialog.emit();
//   }
//   ////
//   async ngOnInit() {
//     this.projectService.getProjects().subscribe((projects) => {
//       this.projects = projects;
//       this.cdr.detectChanges();
//     });

//     this.projectService.getSelectedProject().subscribe((selectedProject) => {
//       if (selectedProject) {
//         const index = this.projects.findIndex(
//           (project) => project.Id === selectedProject.Id
//         );
//       this.cdr.detectChanges();
//         this.selectedProjectIndex = index !== -1 ? index : 0;
//         this.cdr.detectChanges();

//       }
//     });
//   }

//   selectProject(index: number): void {

//     this.cdr.detectChanges();
//     this.selectedProjectIndex = index;
//     this.cdr.detectChanges();

//     const selectedProject = this.projects[index];
//     this.cdr.detectChanges();

//     this.projectService.selectProject(selectedProject);
//     this.cdr.detectChanges();

//   }

//   percentajeCompleted(sprints: Sprint[] | undefined): number {
//     if (!sprints || sprints.length === 0) {
//       return 0; // Si sprints es undefined o vacío, retornar 0%
//     }
  
//     let completedCount: number = 0;
//     sprints.forEach((element) => {
//       if (element.State === 3) {
//         completedCount++;
//       }
//     });
  
//     return (completedCount / sprints.length) * 100;
//   }
// }

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
        this.projects = projects;
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
