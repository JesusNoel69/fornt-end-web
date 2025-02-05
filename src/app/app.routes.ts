import { Routes } from '@angular/router';
import { PrincipalBoardComponent } from './components/principal-board/principal-board.component';
import { ScrumBoardComponent } from './components/scrum-board/scrum-board.component';
import { SprintBoardComponent } from './components/sprint-board/sprint-board.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';


export const routes: Routes = [
    {path: 'home', component: PrincipalBoardComponent},
    {path: 'sprints', component: SprintBoardComponent},
    {path: 'scrum', component: ScrumBoardComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},

    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
