import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { combineLatest, Subject, switchMap, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { UserDataDto } from '../../../dtos/userdata.dto';
import { IntegrationService } from '../../../services/integration.service';
import { AnalysisResult } from '../../../dtos/analysisresult.dto';


@Component({
  selector: 'app-general-configuration',
  standalone: true,
  imports:[MatDialogModule, MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './general-configuration.component.html',
  styleUrl: './general-configuration.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralConfigurationComponent implements OnInit, OnDestroy {
    userId!: number;
    userRol!: boolean;
    perfilData?: UserDataDto;
    public data?: AnalysisResult;//{ Message: string; Secrets: any[] };
    private destroy$ = new Subject<void>();

    constructor(private userService: UserService,  private cdr: ChangeDetectorRef
                ,private integrationService: IntegrationService) {}

    ngOnInit(): void {
      combineLatest([
        this.userService.userId$,
        this.userService.userRol$
      ])
      .pipe(
        takeUntil(this.destroy$),
        switchMap(([id, rol]) => {
          this.userId = id;
          this.userRol = rol;
          this.cdr.markForCheck();
          return this.userService.getUserData(id);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: data => {
          this.perfilData = data;
          console.log('Datos de perfil:', data);
          this.cdr.markForCheck();
        },
        error: err => {
          console.error('Error al obtener UserData', err);
        }
      });
    }

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
    
    // uploadFiles(files: File[]) {
    //   const formData = new FormData();
    //   files.forEach(file => {
    //     formData.append('files', file, file.webkitRelativePath);
    //   });
    //   this.http.post<{ Message: string; Secrets: any[] }>(ENVIRONMENT+'Integrations/AnalizeProject', formData)
    //     .subscribe(response => {
    //       this.data=response;
    //       this.cdr.markForCheck();
    //       console.log('Análisis enviado con éxito:', response);
    //     });
    // }
    uploadFiles(files: File[]) {
      const formData = new FormData();
      files.forEach(file =>
        formData.append('files', file, file.webkitRelativePath)
      );
      this.integrationService.upload(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.data = response;
            this.cdr.markForCheck();
            console.log('Análisis enviado con éxito:', response);
          },
          error: (err) => {
            console.error('Error al enviar análisis:', err);
          }
        });
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}
