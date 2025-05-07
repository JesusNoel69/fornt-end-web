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
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatDivider } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-principal-board',
  standalone: true,
  imports: [SideProjectsComponent, SprintDetailsComponent, SprintsPrincipalComponent, DataPrincipalComponent, MatGridListModule, MatButtonModule, MatIconModule, MatDivider, FormsModule],
  templateUrl: './principal-board.component.html',
  styleUrl: './principal-board.component.css'
})
export class PrincipalBoardComponent {
  overlayOpen = false;
  constructor(private dialog: MatDialog, private bo: BreakpointObserver) {}
  isSmallScreen(): boolean {
    return this.bo.isMatched('(max-width: 767px)');
  }
  openDialog() {
    this.dialog.open(AddProjectComponent, {
      width: '70%',
      data: { message: '¡Hola desde el diálogo!' }
    });
  }

  toggleOverlay(): void {
    this.overlayOpen = !this.overlayOpen;
  }
}
