import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideProjectsComponent implements OnInit {
  selectedProjectIndex: number = 0;
  projects: Project[] = [];

  constructor(private projectService: ProjectService, private cdr: ChangeDetectorRef) {

  }
  ///
  @Output() openDialog = new EventEmitter<void>();

  openAddClick() {
    this.openDialog.emit();
  }
  ////
  async ngOnInit() {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.cdr.detectChanges();
    });

    this.projectService.getSelectedProject().subscribe((selectedProject) => {
      if (selectedProject) {
        const index = this.projects.findIndex(
          (project) => project.Id === selectedProject.Id
        );
      this.cdr.detectChanges();
        this.selectedProjectIndex = index !== -1 ? index : 0;
        this.cdr.detectChanges();

      }
    });
  }

  selectProject(index: number): void {

    this.cdr.detectChanges();
    this.selectedProjectIndex = index;
    this.cdr.detectChanges();

    const selectedProject = this.projects[index];
    this.cdr.detectChanges();

    this.projectService.selectProject(selectedProject);
    this.cdr.detectChanges();

  }

  percentajeCompleted(sprints: Sprint[] | undefined): number {
    if (!sprints || sprints.length === 0) {
      return 0; // Si sprints es undefined o vacío, retornar 0%
    }
  
    let completedCount: number = 0;
    sprints.forEach((element) => {
      if (element.State === 3) {
        completedCount++;
      }
    });
  
    return (completedCount / sprints.length) * 100;
  }
  
}
