import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { ENVIRONMENT } from '../../enviroments/enviroment.prod';
import { Developer } from '../entities/developer.entity';
import { Team } from '../entities/team.entity';
import { UserDataDto } from '../dtos/userdata.dto';
import { DeveloperTaskDto } from '../dtos/developertask.dto';
import { ProductOwner } from '../entities/productowner.entity';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userIdSource = new BehaviorSubject<number>(0);
  private userRolSource = new BehaviorSubject<boolean>(false);

  public userId$ = this.userIdSource.asObservable();
  public userRol$ = this.userRolSource.asObservable();

  private baseUrl = `${ENVIRONMENT}User`;
  constructor(private http: HttpClient) {
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
 
  getTeamsByProductOwnerId(ownerId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.baseUrl}/GetTeamsByProductOwnerId/${ownerId}`);
  }

  getDevelopersByTeamId(teamId: number): Observable<Developer[]> {
    return this.http.get<Developer[]>(`${this.baseUrl}/GetDeveloperByTeamId/${teamId}`);
  }

  getUserData(userId: number){
    const url = ENVIRONMENT+'User/GetUserData';        
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<UserDataDto>(
      `${this.baseUrl}/GetUserData`,
      { params }
    );
  }
  getDevelopersByIds(ids: number[]){
    return this.http.post<Developer[]>(`${ENVIRONMENT}User/GetDevelopersByIds`, ids)
  }

  getDevelopersByTasksIds(taskIds: number[]){
    return this.http.post<DeveloperTaskDto[]>(`${ENVIRONMENT}User/GetDevelopersByTasksIds`, taskIds)
  }

  addTeam(newTeam: Team){
    const addTeamUrl = ENVIRONMENT+'User/AddTeam';
    return this.http.post<Team>(addTeamUrl, newTeam);
  }
  
  addProductOwner(newProductOwner: ProductOwner){
    const addOwnerUrl = ENVIRONMENT+'User/AddProductOwner';
    return this.http.post<ProductOwner>(addOwnerUrl, newProductOwner)
  }

  getTeamById(teamId: number){
    const teamUrl = ENVIRONMENT+'User/GetTeamById/' + teamId;
    return this.http.get<Team>(teamUrl)
  }

  getProductOwner(teamId: number){
    const urlOwner = ENVIRONMENT+'User/GetProductOwner/' + teamId;
    return this.http.get<ProductOwner>(urlOwner)
  }

  addDeveloper(newDeveloper: Developer){
    const addDevUrl = ENVIRONMENT+'User/AddDeveloper';
    return this.http.post(addDevUrl, newDeveloper)
  }
  
//  const url = ENVIRONMENT+'User/GetUserData';
//       const params = new HttpParams().set('userId', this.userId.toString());

//       this.http
//         .get<UserData>(url, { params, responseType: 'json' as const })
}
