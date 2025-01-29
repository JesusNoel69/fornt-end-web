import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Project } from '../../entities/project.entity';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-data-principal',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './data-principal.component.html',
  styleUrl: './data-principal.component.css',
})
export class DataPrincipalComponent implements OnInit {
  project: Project | null = null;
  name: string = '';
  startDate: Date | null = null;
  state: string = '';
  repository: string = '';
  serverImage: string = '';


  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getSelectedProject().subscribe((project) => {
      this.project = project;
      if (this.project) {
        this.name = `Proyecto ${this.project.ProjectNumber}`;
        this.startDate = this.project.StartDate;
        this.state = this.terminatedProject(this.project.State);
        this.serverImage=this.project.ServerImage??"";
        this.repository=this.project.Repository??"";
      } else {
        this.name = '';
        this.startDate = null;
        this.state = '';
      }
    });
  }

  terminatedProject(state: number | undefined): string {
    if (state === 1) {
      return 'Por hacer';
    } else if (state === 2) {
      return 'En progreso';
    } else if (state === 3) {
      return 'Terminado';
    }
    return '';
  }
  navigateTo(url: string): void {
    window.open(url, '_blank');
  }
}
