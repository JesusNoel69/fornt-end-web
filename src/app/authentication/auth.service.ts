import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  token: string;
  // Otros datos que el backend envíe, como información del usuario
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5038/auth'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  // Método de login: espera credenciales y retorna la respuesta del backend
  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  // Método de registro: envía los datos del usuario y retorna la respuesta del backend
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Guarda el token en localStorage (o sessionStorage)
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obtiene el token
  getToken(): string | null {
    return localStorage.getItem('token');
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
