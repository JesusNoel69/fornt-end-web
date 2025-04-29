import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userIdSource = new BehaviorSubject<number>(0);
  private userRolSource = new BehaviorSubject<boolean>(false);

  public userId$ = this.userIdSource.asObservable();
  public userRol$ = this.userRolSource.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }
  // setUser(id: number, rol: boolean) {
  //   this.userIdSource.next(id);
  //   this.userRolSource.next(rol);
  // }
  setUser(id: number, role: boolean) {
    this.userIdSource.next(id);
    this.userRolSource.next(role);
    localStorage.setItem('userId', id.toString());
    localStorage.setItem('userRole', role.toString());
  }
  get currentUserId(): number {
    return this.userIdSource.value;
  }

  get currentUserRol(): boolean {
    return this.userRolSource.value;
  }

  private loadUserFromStorage() {
    const storedId = localStorage.getItem('userId');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedId) this.userIdSource.next(parseInt(storedId, 10));
    if (storedRole) this.userRolSource.next(storedRole === "true");
  }

  clearUser() {
    this.userIdSource.next(0);
    this.userRolSource.next(false);
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }

  public getUser(){
    
  }
}
