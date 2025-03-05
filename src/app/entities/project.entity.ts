// import { ProductBacklog } from "./productbacklog.entity";
// import { Sprint } from "./sprint.entity";
// import { TeamProject } from "./teamproject.entity";

// export interface Project {
//     Id: number;
//     StartDate: Date;
//     State: number;
//     Repository: string;
//     ServerImage: string | null;
//     ProjectNumber: number;
//     Sprints: Sprint[];
//     TeamProjects: TeamProject[]; // Cambiado a plural y como array
//     ProductBacklog: ProductBacklog;
// }
import { ProductBacklog } from "./productbacklog.entity";
import { Sprint } from "./sprint.entity";
import { TeamProject } from "./teamproject.entity";

export interface Project {
    Id: number;
    StartDate: Date;
    State: number;
    Repository: string;
    ServerImage: string | null;
    ProjectNumber: number;
    Sprints: Sprint[];
    TeamProjects: TeamProject[]; // Cambiado a plural y como array
    ProductBacklog: ProductBacklog;
}
