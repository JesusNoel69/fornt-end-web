import { Sprint } from "./sprint.entity";
import { Task } from "./Task.entity";
import { User } from "./User.entity";

export interface ChangeDetails
{
    Id: number;
    SprintNumber: number;
    UserData: string | null;
    TaskInformation: string | null;
    Task: Task | null;
    User: User | null; 
    Sprint: Sprint | null;
}