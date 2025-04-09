import { Developer } from "./developer.entity";
import { Task } from "./Task.entity";

export interface WeeklyScrum{
    Id:number;
    CreatedAt:Date;
    Task:Task;
    Information:string;
    Developer:Developer;
    DeveloperId: number;
}