import { ChangeDetails } from "./changedetails.entity";
import { Project } from "./project.entity";
import { Task } from "./Task.entity";

export interface Sprint{
    Id: number;
    StartDate: Date;
    EndDate: Date;
    Description: string;
    State: number;
    Repository: string;
    Goal: string;
    ProjectNumber: number;
    ChangeDetails: ChangeDetails[];
    Tasks: Task[];
    Project: Project;
}