import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../entities/User.entity';
import { ENVIROMENT } from '../../enviroments/enviroment.prod';

interface LoginResponse {
  token: string;
  user: User
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = ENVIROMENT+'auth';

  constructor(private http: HttpClient) {}

  // // Método de login: espera credenciales y retorna la respuesta del backend
  // login(credentials: { username: string; password: string }): Observable<LoginResponse> {
  //   return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  // }
  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUser(response.user);
      })
    );
  }

  // Método de registro: envía los datos del usuario y retorna la respuesta del backend
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Guarda el token en localStorage (o sessionStorage)
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Obtiene el token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  // Remueve el token para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
