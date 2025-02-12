import { Component } from '@angular/core';
import { SideProjectsComponent } from "../side-projects/side-projects.component";
import { SprintDetailsComponent } from "../sprint-details/sprint-details.component";
import { SprintsPrincipalComponent } from "../sprints-principal/sprints-principal.component";
import { DataPrincipalComponent } from "../data-principal/data-principal.component";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectComponent } from '../dialogs/add-project/add-project.component';

@Component({
  selector: 'app-principal-board',
  standalone: true,
  imports: [SideProjectsComponent, SprintDetailsComponent, SprintsPrincipalComponent, DataPrincipalComponent, MatGridListModule, MatButtonModule, MatIconModule],
  templateUrl: './principal-board.component.html',
  styleUrl: './principal-board.component.css'
})
export class PrincipalBoardComponent {
  constructor(private dialog: MatDialog) {}
  openDialog() {
    this.dialog.open(AddProjectComponent, {
      width: '70%',
      data: { message: '¡Hola desde el diálogo!' }
    });
  }
}
