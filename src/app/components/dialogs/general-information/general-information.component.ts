// import { CommonModule } from '@angular/common';
// import { ChangeDetectionStrategy, Component } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import {MatDialogModule} from '@angular/material/dialog';
// import { MatDivider } from '@angular/material/divider';
// import { MatTableModule } from '@angular/material/table';


// @Component({
//   selector: 'app-general-information',
//   standalone: true,
//   imports: [MatDialogModule, MatCardModule, MatButtonModule, MatTableModule, CommonModule, MatDivider],
//   templateUrl: './general-information.component.html',
//   styleUrl: './general-information.component.css',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class GeneralInformationComponent {
//   columns = [
//     { initials: 'AJ', color: '#E57373', content: 'Información del Scrum semanal' },
//     { initials: 'AJ', color: '#9575CD', content: '' },
//     { initials: 'AJ', color: '#4DD0E1', content: '' },
//     { initials: 'AJ', color: '#81C784', content: '' },
//     { initials: 'AJ', color: '#FFF176', content: '' }
//   ];
// }
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
// import { MatTableModule } from '@angular/material/table';
import { Sprint } from '../../../../../src/app/entities/sprint.entity';
import { WeeklyScrum } from '../../../../../src/app/entities/weeklyscrum.entity';

@Component({
  selector: 'app-general-information',
  standalone: true,
  imports: [MatDialogModule, MatCardModule, MatButtonModule, CommonModule, MatDivider],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.css',
})
export class GeneralInformationComponent implements OnChanges {
  sprint: Sprint;
  columns: { initials: string; color: string; content: string }[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { sprint: Sprint }) {
    this.sprint = data.sprint;
    this.generateScrumData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sprint']) {
      this.generateScrumData();
    }
  }

  private generateScrumData(): void {
    if (!this.sprint?.Tasks) {
        this.columns = [];
        return;
    }

    // Extraer todos los WeeklyScrum de las tareas
    const scrumEntries: WeeklyScrum[] = this.sprint.Tasks.flatMap(task => task.weeklyScrums || []);

    const colors = ['#E57373', '#9575CD', '#4DD0E1', '#81C784', '#FFF176'];

    this.columns = scrumEntries.map((scrum, index) => {
        const developerName = scrum.Developer?.Name || "Anonimo"; // Asegurar que haya un nombre
        console.log(scrum.Developer);
        const initials = developerName
            .split(' ')
            .map(n => n.charAt(0))
            .join('')
            .toUpperCase();

        return {
            initials: initials.length > 1 ? initials : initials + initials, 
            color: colors[index % colors.length], 
            content: scrum.Information 
        };
    });
}

}