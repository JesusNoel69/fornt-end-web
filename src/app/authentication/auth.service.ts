import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../entities/User.entity';
import { ENVIROMENT } from '../../enviroments/enviroment.prod';

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = ENVIROMENT + 'auth';

  // Estado reactivo de autenticación
  public _authState = new BehaviorSubject<boolean>(this.hasToken());
  authState$ = this._authState.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUser(response.user);
        this._authState.next(true);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._authState.next(false);
  }

  // Verifica si hay token
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Inicializa el estado según token presente
  private hasToken(): boolean {
    return this.isAuthenticated();
  }
}
