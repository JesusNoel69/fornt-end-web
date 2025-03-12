
// import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { SliderUsersComponent } from "../slider-users/slider-users.component";
// import { AddSprintComponent } from '../dialogs/add-sprint/add-sprint.component';
// import { MatDialog } from '@angular/material/dialog';
// import { ProjectService } from '../../services/project.service';
// import { SprintService } from '../../services/sprint.service';
// import { Sprint } from '../../entities/sprint.entity';
// import { switchMap } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { MatGridListModule} from '@angular/material/grid-list';

// @Component({
//   selector: 'app-sprints-principal',
//   standalone: true,
//   imports: [MatCardModule, MatButtonModule, MatIconModule, SliderUsersComponent, MatGridListModule],
//   templateUrl: './sprints-principal.component.html',
//   styleUrl: './sprints-principal.component.css',
// })
// export class SprintsPrincipalComponent implements OnInit {
//   readonly dialog = inject(MatDialog);
//   private projectService = inject(ProjectService);
//   private sprintService = inject(SprintService);
//   private cdr = inject(ChangeDetectorRef);

//   currentIndex = 0;
//   sprints: Sprint[] = [];

//   ngOnInit(): void {
//     // Cada vez que cambie el proyecto, se vuelven a obtener los sprints correspondientes
//     this.projectService.getSelectedProject().pipe(
//       switchMap(project => {
//         if (project) {
//           // Al cambiar de proyecto, limpiamos la selección anterior
//           this.sprintService.selectSprint(null);
//           return this.sprintService.getSprintsByProjectId(project.Id);
//         } else {
//           return of([]);
//         }
//       })
//     ).subscribe(sprints => {
//       this.sprints = sprints;
//       this.currentIndex = 0;
//       if (this.sprints.length > 0) {
//         this.sprintService.selectSprint(this.sprints[0]);
//       } else {
//         this.sprintService.selectSprint(null);
//       }
//       // Forzamos la actualización de la UI
//       this.cdr.detectChanges();
//     });
//   }

//   // Método para seleccionar un sprint manualmente
//   selectSprint(sprint: Sprint): void {
//     this.sprintService.selectSprint(sprint);
//   }

//   nextSlide(): void {
//     if (this.currentIndex < this.sprints.length - 2) {
//       this.currentIndex++;
//     }
//   }

//   prevSlide(): void {
//     if (this.currentIndex > 0) {
//       this.currentIndex--;
//     }
//   }

//   openAddSprint(): void {
//     const dialogRef = this.dialog.open(AddSprintComponent, { width: '70%' });
  
//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         // Al agregar un sprint nuevo, volvemos a cargar los sprints del proyecto
//         this.projectService.getSelectedProject().pipe(
//           switchMap(project => {
//             if (project) {
//               return this.sprintService.getSprintsByProjectId(project.Id);
//             } else {
//               return of([]);
//             }
//           })
//         ).subscribe(sprints => {
//           this.sprints = sprints;
//           this.currentIndex = 0;
//           if (this.sprints.length > 0) {
//             this.sprintService.selectSprint(this.sprints[0]);
//           } else {
//             this.sprintService.selectSprint(null);
//           }
//           this.cdr.detectChanges();
//         });
//       }
//     });
//   }
// }
import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SliderUsersComponent } from "../slider-users/slider-users.component";
import { AddSprintComponent } from '../dialogs/add-sprint/add-sprint.component';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { SprintService } from '../../services/sprint.service';
import { Sprint } from '../../entities/sprint.entity';
import { Project } from '../../entities/project.entity';
import { switchMap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-sprints-principal',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, SliderUsersComponent, MatGridListModule],
  templateUrl: './sprints-principal.component.html',
  styleUrls: ['./sprints-principal.component.css'],
})
export class SprintsPrincipalComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  private projectService = inject(ProjectService);
  private sprintService = inject(SprintService);
  private cdr = inject(ChangeDetectorRef);
  
  // Propiedad para almacenar el proyecto seleccionado
  selectedProject: Project | null = null;
  
  // Subject para cancelar suscripciones al destruir el componente
  private destroy$ = new Subject<void>();

  currentIndex = 0;
  sprints: Sprint[] = [];

  ngOnInit(): void {
    // Cada vez que cambia el proyecto, obtenemos (o reutilizamos en caché) los sprints correspondientes
    this.projectService.getSelectedProject().pipe(
      switchMap(project => {
        this.selectedProject = project;
        if (project) {
          // Limpiamos la selección anterior de sprint
          this.sprintService.selectSprint(null);
          return this.sprintService.getSprintsByProjectId(project.Id);
        } else {
          return of([]);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe(sprints => {
      this.sprints = sprints;
      this.currentIndex = 0;
      if (this.sprints.length > 0) {
        this.sprintService.selectSprint(this.sprints[0]);
      } else {
        this.sprintService.selectSprint(null);
      }
      this.cdr.markForCheck();
    });
  }

  // Método para seleccionar un sprint manualmente
  selectSprint(sprint: Sprint): void {
    this.sprintService.selectSprint(sprint);
  }

  nextSlide(): void {
    if (this.currentIndex < this.sprints.length - 2) {
      this.currentIndex++;
    }
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  openAddSprint(): void {
    const dialogRef = this.dialog.open(AddSprintComponent, { width: '70%' });
  
    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$),
      switchMap(result => {
        if (result && this.selectedProject) {
          return this.projectService.refreshProjectById(this.selectedProject.Id);
        } else {
          return of(null);
        }
      }),
      switchMap(updatedProject => {
        if (updatedProject) {
          this.projectService.updateSelectedProject(updatedProject);
          return this.sprintService.getSprintsByProjectId(updatedProject.Id);
        }
        return of([]);
      })
    ).subscribe({
      next: (sprints) => {
        console.log("Sprints actualizados:", sprints);
        this.sprints = sprints;
        this.currentIndex = 0;
        if (this.sprints.length > 0) {
          this.sprintService.selectSprint(this.sprints[0]);
        } else {
          this.sprintService.selectSprint(null);
        }
        this.cdr.markForCheck(); // 🚀 Forzar la actualización del componente
      },
      error: (err) => {
        console.error("Error refrescando los sprints:", err);
      }
    });
  }
  
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
