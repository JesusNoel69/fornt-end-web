import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { Task } from '../../../entities/Task.entity';
import { Project } from '../../../entities/project.entity';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [MatCard, MatCardModule, MatLabel, ReactiveFormsModule, FormsModule, MatDialogModule, MatButtonModule, MatLabel],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {
  tasks: Task[]=[];
  project: Project = {
    Id: 0,
    StartDate: new Date(),
    State: 1,
    Repository: '',
    ServerImage: '',
    ProjectNumber: 0,
    Sprints: [],
    TeamProject: {
      TeamId: 0,
      ProjectId: 0,
      Teams: [],
      Projects: []
    },
    ProductBacklog: {
      Id: 0,
      UpdateAt: new Date(),
      Comment: '',
      UpdatedBy: '',
      Project: null!,
      Tasks: []
    }
  };
  
  responsible: string = '';
  states: number[] = [1, 2, 3, 4]; // Los posibles estados del proyecto

  addTask(): void {
    this.project.ProductBacklog.Tasks.push({
      Id: this.project.ProductBacklog.Tasks.length + 1,
      Name: '',
      WeeklyScrum: '',
      Description: '',
      State: 1,
      ChangeDetails: [],
      Sprint: null!,
      ProductBacklog: null!,
    });
  }

  setState(state: number): void {
    this.project.State = state;
  }

}