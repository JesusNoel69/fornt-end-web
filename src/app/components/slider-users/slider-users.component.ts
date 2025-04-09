import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MatIcon} from '@angular/material/icon';
import { ProjectService } from '../../services/project.service';
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';

interface User {
  fullName: string;    // Nombre completo
  id: number;          // ID del usuario
  role: string;        // Rol del usuario
  tooltipInfo: string; // Información para el tooltip
  label: string;
  color: string;
  especialization: string;
}

@Component({
  selector: 'app-slider-users',
  standalone: true,
  imports: [MatIcon,  MatTooltipModule],
  templateUrl: './slider-users.component.html',
  styleUrls: ['./slider-users.component.css'],
})
export class SliderUsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  visibleItems: User[] = []; 
  startIndex = 0;
  private cdr = inject(ChangeDetectorRef);
  private projectService = inject(ProjectService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Suscribirse al proyecto seleccionado
    this.projectService.getSelectedProject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((project) => {
        console.log(project)
        if (project) {
          // Llamar al endpoint para obtener los developers usando getTeamProjectsByProjectId
          this.projectService.getTeamProjectsByProjectId(project.Id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (developers) => {
                this.users = developers.map(dev => ({
                  label: this.initialsObtain(dev.Name),
                  fullName: dev.Name,
                  especialization: dev.NameSpecialization??"Especializacion desconocida",
                  id: dev.Id,
                  role: dev.Rol ? "Product Owner" : "Desarrollador", 
                  color: this.generateColor(dev.Id),
                  tooltipInfo: this.createTooltipInfo(dev)
                }));
                this.updateVisibleItems();
                this.cdr.markForCheck();
              },
              error: (err) => {
                console.error("Error al obtener los developers:", err);
              }
            });
        } else {
          this.users = [];
          this.visibleItems = [];
          this.cdr.markForCheck();
        }
      });
  }

  nextSlide(): void {
    if (this.startIndex + 5 < this.users.length) {
      this.startIndex++;
      this.updateVisibleItems();
    }
  }

  initialsObtain(name: string): string {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  }

  // Genera el contenido del tooltip con ID, Nombre, Fecha de Creación y Rol
  createTooltipInfo(dev: any): string {
    return `ID: ${dev.Id.toLocaleString()}
    Nombre: ${dev.Name.toLocaleString()}
    Especialización: ${dev.NameSpecialization ? dev.NameSpecialization.toLocaleString() : "Especialización desconocida"}
    Rol: ${dev.Rol ? "Desarrollador".toLocaleString() : "Product Owner".toLocaleString()}`;
  }  

  prevSlide(): void {
    if (this.startIndex > 0) {
      this.startIndex--;
      this.updateVisibleItems();
    }
  }

  updateVisibleItems(): void {
    this.visibleItems = this.users.slice(this.startIndex, this.startIndex + 5);
  }

  getScale(index: number): string {
    let scale = 1.0;
    if (this.users.length >= 5) {
      if (index === 2) {
        scale = 1.3;
      } else if (index === 1 || index === 3) {
        scale = 1.1;
      } else {
        scale = 1;
      }
    } else if (this.users.length === 4 || this.users.length === 2) {
      if (index === 1 || index === 2) {
        scale = 1.3;
      } else {
        scale = 1.1;
      } 
    } else if (this.users.length === 3) {
      if (index === 1) {
        scale = 1.3;
      } else {
        scale = 1.1;
      } 
    } else {
      scale = 1.3;
    }
    return 'scale(' + scale + ')';
  }

  getZIndex(index: number): number {
    if (index === 0 || index === 4) {
      return 1;
    } else if (index === 1 || index === 3) {
      return 2;
    } else if (index === 2) {
      return 3;
    }
    return 0;
  }

  generateColor(id: number): string {
    const colors = ['#8BC34A', '#81C784', '#FFEB3B', '#9575CD', '#F06292', '#4DB6AC', '#FF7043'];
    return colors[id % colors.length];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

/* ngOnInit(): void {
    this.sprintService.getSelectedSprint().subscribe((sprint) => {
      if (sprint) {
        this.content = {
          goal: sprint.Goal,
          description: sprint.Description,
          startDate: sprint.StartDate,
          endDate: sprint.EndDate,
        };
        this.value=this.progressValue(sprint);
      } else {
        this.content = null;
        this.value=0;
      }

      //forzar que se detecten los cambios
      this.cdr.detectChanges();
    });
  }*/