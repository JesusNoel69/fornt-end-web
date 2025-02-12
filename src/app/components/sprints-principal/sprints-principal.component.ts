import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SliderUsersComponent } from "../slider-users/slider-users.component";
import { AddSprintComponent } from '../dialogs/add-sprint/add-sprint.component';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { SprintService } from '../../services/sprint.service';
import { Sprint } from '../../entities/sprint.entity';

@Component({
  selector: 'app-sprints-principal',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, SliderUsersComponent],
  templateUrl: './sprints-principal.component.html',
  styleUrl: './sprints-principal.component.css',
})
export class SprintsPrincipalComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  private projectService = inject(ProjectService);
  private sprintService = inject(SprintService);

  currentIndex = 0;
  sprints: Sprint[] = []; // Lista de sprints del proyecto seleccionado

  ngOnInit(): void {
    this.projectService.getSelectedProject().subscribe((project) => {
      if (project) {
        this.sprints = project.Sprints; // Obtener los sprints del proyecto seleccionado
        this.currentIndex=0;
        // if (this.sprints.length > 0) {
        //   this.sprintService.selectSprint(this.sprints[0]);
        // } else {
          this.sprintService.selectSprint(null); // Si no hay sprints, limpiar selección
        // }
      } else {
        this.sprints = []; // Vaciar la lista de sprints si no hay proyecto
        this.currentIndex=0;
        this.sprintService.selectSprint(null); // Limpiar el sprint seleccionado
      }
    });
  }
  

  // Método para seleccionar un sprint
  selectSprint(sprint: Sprint): void {
    this.sprintService.selectSprint(sprint); // Actualizar el sprint seleccionado en el servicio
  }

  nextSlide() {
    if (this.currentIndex < this.sprints.length - 2) {
      this.currentIndex++;
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  openAddSprint() {
    const dialogRef = this.dialog.open(AddSprintComponent, { width: '70%' });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
