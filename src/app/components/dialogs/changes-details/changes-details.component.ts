import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Project } from '../../../entities/project.entity';
import { ProjectService } from '../../../services/project.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetails } from '../../../entities/changedetails.entity';
import { switchMap } from 'rxjs';
import { ENVIROMENT } from '../../../../enviroments/enviroment.prod';

interface ChangeDetailWithTaskNameDto {
  Id: number;
  SprintNumber?: number;
  UserData?: string;
  TaskInformation?: string;
  TaskId: number;
  TaskName: string;
}
@Component({
  selector: 'app-changes-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatCardModule],
  templateUrl: './changes-details.component.html',
  styleUrls: ['./changes-details.component.css'], // Corregido 'styleUrl' a 'styleUrls'
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangesDetailsComponent implements OnInit {
  selectedProject: Project | null = null; // Solo el proyecto seleccionado
  changeDetails: ChangeDetailWithTaskNameDto[] = [];
  // changeDetailsBySprint: { [key: string]: ChangeDetails[] } = {};
  ids: number[] = [];

  constructor(private projectService: ProjectService, private http: HttpClient, private cdr: ChangeDetectorRef) {}


  ngOnInit(): void {
    this.projectService.getSelectedProject().pipe(
      switchMap(project => {
        this.selectedProject = project;
        const url = `${ENVIROMENT}ChangeDetails/GetChangeDetailsByProjectId/${project!.Id}`;
        return this.http.get<ChangeDetailWithTaskNameDto[]>(url);
      })
    ).subscribe({
      next: data => {
        this.changeDetails = data;
        console.log('cambios recibidos:', this.changeDetails);
        this.cdr.markForCheck();
      },
      error: err => console.error('Error al obtener cambios:', err)
    });
  }

  replaceValues(value: string): string {
    if (value?.includes('Actualizacion por parte de ')) {
      return value
        .replace('Actualizacion por parte de ', '')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase())
        .join('');
    }else if(value?.includes('Actualizacion de orden por parte '))
    {
      return value
      .replace('Actualizacion de orden por parte de ', '')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase())
      .join('');
    }
    return 'N/A';
  }
  
}
