import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Project } from '../../../entities/project.entity';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-changes-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatCardModule],
  templateUrl: './changes-details.component.html',
  styleUrls: ['./changes-details.component.css'], // Corregido 'styleUrl' a 'styleUrls'
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangesDetailsComponent implements OnInit {
  selectedProject: Project | null = null; // Solo el proyecto seleccionado

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    // Obtener el proyecto seleccionado desde el servicio
    this.projectService.getSelectedProject().subscribe((project) => {
      this.selectedProject = project; // Asignar el proyecto seleccionado
    });
  }
}
