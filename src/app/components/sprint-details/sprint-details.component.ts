import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ProgressSpinnerMode, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ChangesDetailsComponent } from '../dialogs/changes-details/changes-details.component';
import { Sprint } from '../../entities/sprint.entity';
import { SprintService } from '../../services/sprint.service';

interface Content {
  goal: string | null;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

@Component({
  selector: 'app-sprint-details',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatDivider, MatIcon],
  templateUrl: './sprint-details.component.html',
  styleUrl: './sprint-details.component.css',
})
export class SprintDetailsComponent implements OnInit {
  mode: ProgressSpinnerMode = 'determinate';
  content: Content | null = null; // Contiene los detalles del sprint seleccionado
  value:number = 0;
  sprint: Sprint|null=null;

  private sprintService = inject(SprintService);
  private cdr = inject(ChangeDetectorRef); // Inyección de ChangeDetectorRef
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.sprintService.getSelectedSprint().subscribe((sprint) => {
      if (sprint) {
        this.content = {
          goal: sprint.Goal,
          description: sprint.Description,
          startDate: sprint.StartDate,
          endDate: sprint.EndDate,
        };
        this.value=this.progressValue(sprint);
        this.sprint=sprint;
      } else {
        this.content = null;
        this.value=0;
        this.sprint=null;
      }

      //forzar que se detecten los cambios
      this.cdr.detectChanges();
    });
  }
  progressValue(sprint: Sprint):number{
    /*states:
    1 por hacer 0%
    2 en progreso 30%
    3 revision 75%
    4 terminado 100%
    */
    let value = 0;
    sprint.Tasks.forEach(task => {
      if(task.State==2){
        value+=0.3;
      }else if(task.State==3){
        value+=0.75;
      }else{
        value+=1;
      }
    });
    return (value/sprint.Tasks.length)*100;

  }
  openChangeDetails(): void {
    this.cdr.detectChanges();
    const dialogRef = this.dialog.open(ChangesDetailsComponent, { width: '70%' });
    dialogRef.afterClosed().subscribe((result) => {
      
      console.log(`Dialog result: ${result}`);
    });
  }
}
