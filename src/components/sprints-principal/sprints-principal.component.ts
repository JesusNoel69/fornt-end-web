import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SliderUsersComponent } from "../slider-users/slider-users.component";
import { AddSprintComponent } from '../dialogs/add-sprint/add-sprint.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sprints-principal',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, SliderUsersComponent],
  templateUrl: './sprints-principal.component.html',
  styleUrl: './sprints-principal.component.css'
})
export class SprintsPrincipalComponent {
    readonly dialog = inject(MatDialog);
  currentIndex = 0;
  cards = [
    { title: 'Sprint #1', content: 'Content for Sprint 1' },
    { title: 'Sprint #2', content: 'Content for Sprint 2' },
    { title: 'Sprint #3', content: 'Content for Sprint 3' },
    { title: 'Sprint #4', content: 'Content for Sprint 4' }
  ];

  nextSlide() {
    if (this.currentIndex < this.cards.length - 2) {
      this.currentIndex++;
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

   openAddSprint() {
      const dialogRef = this.dialog.open(AddSprintComponent, {width: '70%'});
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });    
    }
}
