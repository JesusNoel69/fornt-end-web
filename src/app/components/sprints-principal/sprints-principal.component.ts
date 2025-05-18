import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
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
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sprints-principal',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, SliderUsersComponent, MatGridListModule],
  templateUrl: './sprints-principal.component.html',
  styleUrls: ['./sprints-principal.component.css'],
})
export class SprintsPrincipalComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  @ViewChild('slider', { static: false }) sliderContainer!: ElementRef;
  cardWidth: number = 0;
  currentIndex: number = 0;
  private projectService = inject(ProjectService);
  private sprintService = inject(SprintService);
  private cdr = inject(ChangeDetectorRef);
  userId!: number;
  userRol!: boolean;
  initialized: boolean = false;
  constructor(private userService: UserService){}
  selectedSprint: Sprint | null = null;    // <— nuevo
  // Propiedad para almacenar el proyecto seleccionado
  selectedProject: Project | null = null;
  
  // Subject para cancelar suscripciones al destruir el componente
  private destroy$ = new Subject<void>();

  sprints: Sprint[] = [];

  ngOnInit(): void {
    this.userService.userId$.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      console.log(id)
      this.userId = id;
    });

    this.userService.userRol$.pipe(takeUntil(this.destroy$)).subscribe((rol) => {
      this.userRol = rol;
      this.cdr.markForCheck();
    });

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
      this.sprints = sprints.sort((a, b) => b.Id - a.Id);
      this.currentIndex = 0;
      if (this.sprints.length > 0) {
        this.sprintService.selectSprint(this.sprints[0]);
        this.selectedSprint=this.sprints[0];
      } else {
        this.sprintService.selectSprint(null);
      }
      this.cdr.markForCheck();
    });
    this.updateSlideWidth();
  }

  // Método para seleccionar un sprint manualmente
  selectSprint(sprint: Sprint): void {
    this.selectedSprint = sprint;
    this.sprintService.selectSprint(sprint);
  }

  nextSlide(): void {
    this.updateSlideWidth();
      this.cdr.detectChanges();
    if (this.currentIndex < this.sprints.length - 2) {
      this.currentIndex++;
      
    }
  }

  prevSlide(): void {
    this.updateSlideWidth();
      this.cdr.detectChanges();
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
  ngAfterViewInit(): void {
    // Esperamos al siguiente ciclo de detección de cambios
    setTimeout(() => {
      this.updateSlideWidth();
      this.cdr.detectChanges(); // Forzar la actualización
    }, 0);
  }
  ngAfterViewChecked(): void {
    if (!this.initialized && this.sliderContainer?.nativeElement) {
      this.updateSlideWidth();
      this.initialized = true; // Evita re-calculaciones innecesarias
    }
  }
  updateSlideWidth(): void {
    if (this.sliderContainer?.nativeElement) {
      const cards = this.sliderContainer.nativeElement.querySelectorAll('.card');
      if (cards.length > 0) {
        this.cardWidth = cards[0].offsetWidth+10;
        console.log("✅ El tamaño de la card es:", this.cardWidth);
      } else {
        console.warn("🚨 No se encontraron tarjetas en el slider (posible problema de renderizado).");
      }
    }
  }
  

  @HostListener('window:resize')
  onResize(): void {
    this.updateSlideWidth();
  }

  openAddSprint(): void {
    const dialogRef = this.dialog.open(AddSprintComponent, { width: '70%' });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        // 1) Si no hay resultado, salimos sin tocar nada
        if (!result || !this.selectedProject) {
          return;
        }

        // 2) Si sí hay resultado, refrescamos el proyecto y luego los sprints
        this.projectService.refreshProjectById(this.selectedProject.Id)
          .pipe(
            takeUntil(this.destroy$),
            switchMap(updatedProject => {
              // Actualizamos el SelectedProject en el servicio
              this.projectService.updateSelectedProject(updatedProject!);
              // Devolvemos el stream de sprints
              return this.sprintService.getSprintsByProjectId(updatedProject!.Id);
            })
          )
          .subscribe({
            next: sprints => {
              console.log("Sprints actualizados:", sprints);

              this.sprints = sprints;
              this.currentIndex = 0;

              if (sprints.length > 0) {
                this.sprintService.selectSprint(sprints[0]);
              } else {
                this.sprintService.selectSprint(null);
              }

              // Recalcula ancho y refresca vista
              this.updateSlideWidth();
              this.cdr.detectChanges();
            },
            error: err => {
              console.error("Error refrescando los sprints:", err);
            }
          });
      });
  }

  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
