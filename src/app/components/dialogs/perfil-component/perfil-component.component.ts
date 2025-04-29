import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpParams } from '@angular/common/http';

import { UserService } from '../../../services/user.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { ENVIROMENT } from '../../../../enviroments/enviroment.prod';



interface UserData {
  UserName: string;
  IdUser: number;
  InformationAditional?: string;
  TeamId?: number;
  UserAccount: string;
}

@Component({
  selector: 'app-perfil-component',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './perfil-component.component.html',
  styleUrls: ['./perfil-component.component.css']
})
export class PerfilComponentComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  userId!: number;
  userRol!: boolean;
  perfilData?: UserData;
  private cdr = inject(ChangeDetectorRef);

  // Inyectamos HttpClient directamente
  constructor(
    private userService: UserService,
    private http: HttpClient
  ) {}

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

