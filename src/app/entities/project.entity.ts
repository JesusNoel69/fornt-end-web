import { ProductBacklog } from "./ProductBacklog.entity";
import { Sprint } from "./sprint.entity";
import { TeamProject } from "./teamproject.entity";

export interface Project{
    Id: number;
    StartDate: Date;
    State: number;
    Repository: string;
    ServerImage: string | null;
    ProjectNumber: number;
    Sprints: Sprint[];
    TeamProject: TeamProject;
    ProductBacklog: ProductBacklog;
}