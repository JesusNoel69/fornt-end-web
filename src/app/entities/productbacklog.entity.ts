import { Project } from "./project.entity";
import { Task } from "./Task.entity";

export interface ProductBacklog{
    Id :number;
    UpdateAt: Date;
    Comment: string;
    UpdatedBy: string;
    Project: Project;
    Tasks: Task[];
}