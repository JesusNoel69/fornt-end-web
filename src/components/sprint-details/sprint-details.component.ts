import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {ProgressSpinnerMode, MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ChangesDetailsComponent } from '../dialogs/changes-details/changes-details.component';

@Component({
  selector: 'app-sprint-details',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatDivider, MatIcon],
  templateUrl: './sprint-details.component.html',
  styleUrl: './sprint-details.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class SprintDetailsComponent {
  mode: ProgressSpinnerMode = 'determinate';
  readonly dialog = inject(MatDialog);
  value = 50;
  openChangeDetails() {
      const dialogRef = this.dialog.open(ChangesDetailsComponent, {width: '70%'});
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });    
    }
}
