import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule }       from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ENVIRONMENT } from '../../../../enviroments/enviroment.prod';
import { IntegrationService } from '../../../services/integration.service';
export interface ScanResult {
  Message: string;
  Secrets: Array<{
    Description: string;
    FilePath: string;
    LineNumber: number;
    RuleId: string;
    Snippet: string;
  }>;
}

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [MatDialogModule, MatCardModule, MatButtonModule, MatGridListModule, MatIconModule,  CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule, HttpClientModule ],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.css'
})
export class IssuesComponent {
  public data: ScanResult = { Message: '', Secrets: [] };
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<IssuesComponent>,
    private integrationService: IntegrationService
  ) {}
  

    async onFolderSelected(event: any) {
          const files: File[] = Array.from(event.target.files);
        
          const gitignoreFile = files.find(x => x.name === ".gitignore");
        
          let ignoreRules: string[] = [];
          if (gitignoreFile) {
            const content = await gitignoreFile.text();
            ignoreRules = content
              .split('\n')
              .map(line => line.trim())
              .filter(line => line && !line.startsWith('#'));
          }
        
          // Agregamos reglas extra manualmente
          ignoreRules.push('.git/'); // <-- Ignorar carpeta .git completa
          ignoreRules.push('.vscode/'); // Opcional: ignorar otros ocultos
        
          const filteredFiles = files.filter(file => {
            const path = file.webkitRelativePath.replace(/\\/g, '/'); // siempre en formato Linux
        
            // Ignorar archivos en carpetas ocultas o ignoradas
            for (const rule of ignoreRules) {
              if (rule.endsWith('/')) {
                // es carpeta
                if (path.includes(rule)) { 
                  return false;
                }
              } else {
                // es archivo o nombre simple
                if (path.endsWith(rule) || path.includes('/' + rule)) {
                  return false;
                }
              }
            }
        
            return true; // si no coincide con ningún patrón, lo subimos
          });
          console.log(filteredFiles)
          this.uploadFiles(filteredFiles);
        }
        
        uploadFiles(files: File[]) {
          const formData = new FormData();
          files.forEach(file => {
            formData.append('files', file, file.webkitRelativePath);
          });
          // this.http.post<ScanResult>(ENVIRONMENT+'Integrations/AnalizeProject', formData)
            this.integrationService.analizeProject(formData).subscribe(response => {
              console.log('Análisis enviado con éxito:', response);
              this.data=response;
            });
        }
}
