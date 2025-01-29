import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Project } from '../../entities/project.entity';
import { Sprint } from '../../entities/sprint.entity';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-side-projects',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './side-projects.component.html',
  styleUrl: './side-projects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideProjectsComponent implements OnInit {
  selectedProjectIndex: number = 0;
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });

    this.projectService.getSelectedProject().subscribe((selectedProject) => {
      if (selectedProject) {
        const index = this.projects.findIndex(
          (project) => project.Id === selectedProject.Id
        );
        this.selectedProjectIndex = index !== -1 ? index : 0;
      }
    });
  }

  selectProject(index: number): void {
    this.selectedProjectIndex = index;
    const selectedProject = this.projects[index];
    this.projectService.selectProject(selectedProject);
  }

  percentajeCompleted(sprints: Sprint[]): number {
    let value: number = 0;
    sprints.forEach((element) => {
      if (element.State === 3) {
        value++;
      }
    });
    return (value / sprints.length) * 100;
  }
}
