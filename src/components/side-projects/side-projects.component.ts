import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-side-projects',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './side-projects.component.html',
  styleUrl: './side-projects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None
})
export class SideProjectsComponent {
  selectedProjectIndex: number = 0;
  projects: any= [1,2,3,4]
  selectProject(index: number): void {
    this.selectedProjectIndex = index;
  }
  
}
