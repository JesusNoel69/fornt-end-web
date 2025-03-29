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

  constructor() {}
  setUser(id: number, rol: boolean) {
    this.userIdSource.next(id);
    this.userRolSource.next(rol);
  }
  get currentUserId(): number {
    return this.userIdSource.value;
  }

  get currentUserRol(): boolean {
    return this.userRolSource.value;
  }
}
