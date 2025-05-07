import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ProgressSpinnerMode, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ChangesDetailsComponent } from '../dialogs/changes-details/changes-details.component';
import { Sprint } from '../../entities/sprint.entity';
import { SprintService } from '../../services/sprint.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Subject, of } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { ENVIROMENT } from '../../../enviroments/enviroment.prod';

import { CommonModule } from '@angular/common';

interface Content {
  goal: string | null;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

@Component({
  selector: 'app-sprint-details',
  standalone: true,
  imports: [MatCardModule, CommonModule ,MatProgressSpinnerModule, MatButtonModule, MatDivider, MatIcon],
  templateUrl: './sprint-details.component.html',
  styleUrls: ['./sprint-details.component.css'], // Asegúrate de que sea styleUrls
})
export class SprintDetailsComponent implements OnInit, OnDestroy {
  mode: ProgressSpinnerMode = 'determinate';
  content: Content | null = null;
  value: number = 0;
  sprint: Sprint | null = null;
  userRol!: boolean;
  userId!: number;
  private sprintService = inject(SprintService);
  private cdr = inject(ChangeDetectorRef);
  readonly dialog = inject(MatDialog);
  private http = inject(HttpClient);

  constructor(private userService: UserService){}
  // Subject para cancelar suscripciones al destruir el componente
  private destroy$ = new Subject<void>();

  async ngOnInit(): Promise<void> {
    this.userService.userId$.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      console.log(id)
      this.userId = id;
    });

    this.userService.userRol$.pipe(takeUntil(this.destroy$)).subscribe((rol) => {
      this.userRol = rol;
      this.cdr.markForCheck();
    });
    this.sprintService.getSelectedSprint()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (sprint) => {
        if (sprint) {
          this.content = {
            goal: sprint.Goal,
            description: sprint.Description,
            startDate: sprint.StartDate,
            endDate: sprint.EndDate,
          };

          // Reseteamos el progreso mientras obtenemos el nuevo
          this.value = 0;

          // Esperamos el nuevo progreso y luego lo asignamos
          this.value = await this.progressValue(sprint);

          console.log("Nuevo progreso:", this.value);
          this.sprint = sprint;
        } else {
          this.content = null;
          this.value = 0;
          this.sprint = null;
        }
        // Forzar la detección de cambios
        this.cdr.detectChanges();
      });
  }
  async progressValue(sprint: Sprint): Promise<number> {
    console.log("Obteniendo progreso de sprint:", sprint);
    try {
      return await firstValueFrom(
        this.http.get<number>(`${ENVIROMENT}Task/GetProgressvalue?sprintId=${sprint.Id}`)
      );
    } catch (error) {
      console.error("Error obteniendo progreso:", error);
      return 0; // En caso de error, devolvemos 0
    }
  }

  openChangeDetails(): void {
    const dialogRef = this.dialog.open(ChangesDetailsComponent, {width: '70%'});//, autoFocus: true
    dialogRef.afterClosed()
      // .pipe(takeUntil(this.destroy$))
      // .subscribe((result) => {
      //   console.log(`Dialog result: ${result}`);
      // });
    this.cdr.detectChanges();

    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
