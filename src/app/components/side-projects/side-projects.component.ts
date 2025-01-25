import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { Project } from '../../entities/project.entity';
import { Sprint } from '../../entities/sprint.entity';
import { projects } from '../../mocks/project.mock';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-side-projects',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './side-projects.component.html',
  styleUrl: './side-projects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None
})
export class SideProjectsComponent implements OnInit{
  selectedProjectIndex: number = 0;
  // projects: any= [1,2,3,4]
  projects: Project[] = projects;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }

  selectProject(index: number): void {
    this.selectedProjectIndex = index;
    const selectedProject = this.projects[index];
    // console.log(selectedProject)
    this.projectService.selectProject(selectedProject);
  }
  percentajeCompleted(sprints:Sprint[]):number{
    /*
    sprint states: 
    1 por hacer
    2 en progreso
    3 terminado
    */
    let value:number=0;
    sprints.forEach(element => {
      if(element.State==3){
        value++;
      }
    });
    value=value/sprints.length*100;
    // console.log(value);
    return value;
  }
  
}
