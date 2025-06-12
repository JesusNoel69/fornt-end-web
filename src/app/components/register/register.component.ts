import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { Developer } from '../../entities/developer.entity';
import { ProductOwner } from '../../entities/productowner.entity';
import { Team } from '../../entities/team.entity';
import { Router } from '@angular/router';
import { AuthService } from '../../authentication/auth.service';
import { UserService } from '../../services/user.service';
// import { ENVIRONMENT } from '../../../enviroments/enviroment.prod';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatRadioModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name: string = '';
  account: string = '';
  password: string = '';
  // Para Developer se ingresa un teamId; para Product Owner se creará un nuevo equipo.
  teamId: number = 0;
  role: boolean = true; 
  productOwner: ProductOwner = null as any;
  nameSpecialization: string = "";
  team: Team = null as any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  register() {
    if (this.role) {
      console.log("PRODUCTOWNER")
      // Registro para Product Owner:
      const newTeam: Team = {
        Id: 0,
        Name: this.name + "'s Team", 
        Code: '',
        ProductOwner: null as any,
        Developers: [],
        TeamProject: null as any
      };

      this.userService.addTeam(newTeam).subscribe({
        next: (teamResponse) => {
          this.team = teamResponse;
          console.log("Nuevo equipo creado:", this.team);
        },
        error: (err) => {
          console.error("Error al crear el equipo:", err);
        }
      });

      const newProductOwner: ProductOwner = {
        Id: 0, // Se genera automáticamente en la BD.
        Name: this.name,
        Account: this.account,
        Password: this.password,
        Team: this.team,
        StakeHolderContact: '',
        Rol: true, // true indica que es Product Owner.
        ProductOwner: null as any,
        Developer: null as any,
        ChangeDetails: null as any
      };
     this.userService.addProductOwner(newProductOwner).subscribe({
        next: (ownerResponse) => {
          console.log("Product Owner registrado exitosamente:", ownerResponse);
          this.autoLogin();
        },
        error: (err) => {
          console.error("Error al registrar el Product Owner:", err);
        }
      });
    } else {
      console.log("DEVELOPER")

    this.userService.getTeamById(this.teamId).subscribe({
        next: (teamResponse) => {
          this.team = teamResponse;
          console.log("Equipo obtenido:", this.team);
          this.userService.getProductOwner(this.teamId).subscribe({
            next: (ownerResponse) => {
              this.productOwner = ownerResponse;
              console.log("Product Owner obtenido:", this.productOwner);
              const newDeveloper: Developer = {
                Id: 0, // Se genera automáticamente en la BD.
                Name: this.name,
                Account: this.account,
                Password: this.password,
                NameSpecialization: this.nameSpecialization,
                ProductOwner: this.productOwner,
                Rol: false, // false indica que es Developer.
                ChangeDetails: null as any,
                Developer: null as any,
                Team: this.team,
                WeeklyScrum: null
              };

              this.userService.addDeveloper(newDeveloper).subscribe({
                next: (devResponse) => {
                  console.log("Desarrollador registrado exitosamente:", devResponse);
                  this.autoLogin();
                },
                error: (err) => {
                  console.error("Error al registrar el desarrollador:", err);
                }
              });
            },
            error: (err) => {
              console.error("Error al obtener el Product Owner:", err);
            }
          });
        },
        error: (err) => {
          console.error("Error al obtener el equipo:", err);
        }
      });
    }
  }
  
  autoLogin() {
    const loginPayload = { username: this.account, password: this.password };
    
    this.authService.login(loginPayload).subscribe({
      next: (loginResponse) => {
        this.authService.setToken(loginResponse.token);
        this.authService.setUser(loginResponse.user);
        this.userService.setUser(loginResponse.user.Id, loginResponse.user.Rol);
        
        console.log("Login automático exitoso, token:", loginResponse.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error("Error en el login automático:", err);
      }
    });
  }
  
  cancel() {
    console.log('Registro cancelado');
    this.name = '';
    this.account = '';
    this.password = '';
    this.teamId = 0;
    this.router.navigate(['/login']);
  }
}
