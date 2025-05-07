import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Project } from '../../entities/project.entity';
import { ProjectService } from '../../services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { IssuesComponent } from '../dialogs/issues/issues.component';

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

  readonly dialog = inject(MatDialog);
    

  constructor(private projectService: ProjectService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.projectService.getSelectedProject().subscribe({
      next: (project) => {
        // console.log("Proyecto seleccionado:", project);
        this.project = project;
        if (this.project!=null) {
          console.log("es:" +this.project.ServerImage)

          this.name = `Proyecto ${this.project.ProjectNumber}`;
          this.startDate = this.project.StartDate;
          this.state = this.terminatedProject(this.project.State);
          this.serverImage = this.project.ServerImage ?? "";
          this.repository = this.project.Repository ?? "";

        } else {
          this.name = 'Sin proyecto seleccionado';
          this.startDate = null;
          this.state = '';
          this.repository = '';
          this.serverImage = '';

        }
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error("Error al obtener el proyecto seleccionado:", err);
      }
    });
  }

  openIssues() {
      // Simulamos la respuesta del escaneo
      // const response = {
      //   Message: 'Archivos analizados',
      //   Secrets: [
      //     {
      //       Description: 'Valor por defecto de URL hardcodeado',
      //       FilePath: 'C:\\...\\Program.cs',
      //       LineNumber: 21,
      //       RuleId: 'HardcodedUrlFallback',
      //       Snippet: 'string url = Environment.GetEnvironmentVariable("URL")??"AllowAll";'
      //     },
      //     {
      //       Description: 'Orígenes CORS definidos directamente en código...',
      //       FilePath: 'C:\\...\\Program.cs',
      //       LineNumber: 51,
      //       RuleId: 'HardcodedCorsOrigins',
      //       Snippet: '.WithOrigins(["https://lucky-cendol..."])'
      //     },
      //     {
      //       Description: 'Cadena de conexión MySQL hardcodeada en el código',
      //       FilePath: 'C:\\...\\Program.cs',
      //       LineNumber: 59,
      //       RuleId: 'HardcodedConnectionString',
      //       Snippet: 'options.UseMySql("server=185.42.105.187;...")'
      //     },
      //   ]
      // };
  
      this.dialog.open(IssuesComponent, {
        width: '70%',
        // height: '70%',
        // data: response
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
    return 'Desconocido';
  }

  navigateTo(url: string): void {
    window.open(url, '_blank');
  }
}
