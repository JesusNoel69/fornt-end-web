import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { ENVIROMENT } from '../../../../enviroments/enviroment.prod';

interface UserData {
  UserName: string;
  IdUser: number;
  InformationAditional?: string;
  TeamId?: number;
  UserAccount: string;
}

@Component({
  selector: 'app-general-configuration',
  standalone: true,
  imports:[MatDialogModule, MatCardModule, MatButtonModule],
  templateUrl: './general-configuration.component.html',
  styleUrl: './general-configuration.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralConfigurationComponent implements OnInit, OnDestroy {
    userId!: number;
    userRol!: boolean;
    perfilData?: UserData;
    private cdr = inject(ChangeDetectorRef);
    private destroy$ = new Subject<void>();

  
    constructor(private http: HttpClient, private userService: UserService) {}

      ngOnInit(): void {
        // Esperamos a tener userId y userRol
        combineLatest([
          this.userService.userId$,
          this.userService.userRol$
        ])
        .pipe(takeUntil(this.destroy$))
        .subscribe(([id, rol]) => {
          this.userId = id;
          this.userRol = rol;
          this.cdr.markForCheck();
    
          // Llamada HTTP directa al endpoint GetUserData
          const url = ENVIROMENT+'User/GetUserData';
          const params = new HttpParams().set('userId', this.userId.toString());
    
          this.http
            .get<UserData>(url, { params, responseType: 'json' as const })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: data => {
                this.perfilData = data;
                console.log(data);
                this.cdr.markForCheck();
              },
              error: err => {
                console.error('Error al obtener UserData', err);
              }
            });
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
      
      uploadFiles(files: File[]) {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file, file.webkitRelativePath);
        });
        this.http.post(ENVIROMENT+'Integrations/AnalizeProject', formData)
          .subscribe(response => {
            console.log('Análisis enviado con éxito:', response);
          });
      }
      

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}
