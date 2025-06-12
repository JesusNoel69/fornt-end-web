import { Component, ChangeDetectionStrategy, inject, Inject, ChangeDetectorRef } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { GeneralConfigurationProductOwnerComponent } from "../dialogs/general-configuration-product-owner/general-configuration-product-owner.component";
import { GeneralConfigurationComponent } from "../dialogs/general-configuration/general-configuration.component";
import { PerfilComponentComponent } from "../dialogs/perfil-component/perfil-component.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from "@angular/material/menu";
import { AuthService } from "../../authentication/auth.service";
import { Observable, Subject, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { UserService } from "../../services/user.service";


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDividerModule, RouterLink, RouterLinkActive,  MatToolbarModule,
    MatIconModule, CommonModule, RouterModule,
    MatButtonModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  readonly dialog = inject(MatDialog);
  readonly router =inject(Router);
  readonly authService = inject(AuthService);
  readonly userService = inject(UserService);
  isLoggedIn$ = this.authService.authState$;
  isProductOwner$:Observable<boolean>;//=this.userService.userRol$;
  constructor(){
    this.isProductOwner$ = this.userService.userRol$;
  }
  openGeneralConfiguration() {
    const dialogRef = this.dialog.open(GeneralConfigurationComponent, {width: '70%'});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });    
  }
  openGeneralConfigurationProductOwner() {
    const dialogRef = this.dialog.open(GeneralConfigurationProductOwnerComponent, {width: '70%'});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });    
  }
  openPerfilInformation(){
    const dialogRef = this.dialog.open(PerfilComponentComponent, {width: '70%'});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  logout() {
    // Elimina token y redirige al login
    this.authService.logout();
    localStorage.removeItem('token'); 
    this.router.navigate(['/login']);
    this.isLoggedIn$!=this.isLoggedIn$;
  }
  
}
