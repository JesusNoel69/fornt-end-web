import { Component, OnInit, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ProjectService } from '../../services/project.service';

interface User {
  label: string;
  color: string;
}

@Component({
  selector: 'app-slider-users',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './slider-users.component.html',
  styleUrl: './slider-users.component.css',
})
export class SliderUsersComponent implements OnInit {
  users: User[] = [];
  visibleItems: User[] = []; 
  startIndex = 0;
  private projectService = inject(ProjectService);

  ngOnInit(): void {
    this.projectService.getSelectedProject().subscribe((project) => {
      if (project && project.TeamProject) {
        this.users = project.TeamProject.Teams[0]?.Developers.map((dev) => ({
          label: dev.Name,
          color: this.generateColor(dev.Id),
        })) || [];
      } else {
        this.users = [];
      }
      this.updateVisibleItems();
    });
  }

  nextSlide() {
    if (this.startIndex + 5 < this.users.length) {
      this.startIndex++;
      this.updateVisibleItems();
    }
  }

  prevSlide() {
    if (this.startIndex > 0) {
      this.startIndex--;
      this.updateVisibleItems();
    }
  }

  updateVisibleItems() {
    this.visibleItems = this.users.slice(this.startIndex, this.startIndex + 5);
  }

  getScale(index: number): string {
    if (index === 2) {
      return 'scale(1.3)';
    } else if (index === 1 || index === 3) {
      return 'scale(1.1)';
    } else {
      return 'scale(1)';
    }
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