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
  changeDetails: ChangeDetails[]=[];
  changeDetailsBySprint: { [key: string]: ChangeDetails[] } = {};
  ids: number[] = [];


  constructor(private projectService: ProjectService, private http: HttpClient, private cdr: ChangeDetectorRef) {}


  ngOnInit(): void {
    // Obtener el proyecto seleccionado desde el servicio
    this.projectService.getSelectedProject().pipe(
      switchMap((project) => {
        this.selectedProject = project; // Asignar el proyecto seleccionado
  
        // Realizar la solicitud HTTP para obtener los detalles del cambio
        const url = `http://localhost:5038/ChangeDetails/GetChangeDetailsByProjectId/${this.selectedProject?.Id}`;
        return this.http.get<ChangeDetails[]>(url); // Regresar el observable de la solicitud
      })
    ).subscribe({
      next: (data) => {
        this.changeDetails = data;
        this.ids = data.map(x => x.Id); // Si deseas solo los Ids de los cambios
  
        console.log('recibidos:', data);
        this.cdr.markForCheck(); // Aseguramos que la vista se actualice
      },
      error: (err) => {
        console.error('Error al obtener:', err);
      }
    });
  }
  replaceValues(value: string){
    if (value && value.includes('Actualizacion por parte de ')) {
      // Eliminar la parte inicial
      return value
        .replace('Actualizacion por parte de ', '')
        .split(' ') // Dividir por espacios
        .map(word => word.charAt(0).toUpperCase()) // Tomar la primera letra y convertirla a mayúscula
        .join(''); // Unir las letras en una sola cadena
    } else {
      return 'N/A'; // Si no incluye el texto esperado, retornar 'N/A'
    }
  }
  
}
