import { Project } from "./project.entity";
import { Team } from "./team.entity";

export interface TeamProject{
    TeamId:number;
    ProjectId:number;
    Teams:Team[];
    Projects:Project[];
}