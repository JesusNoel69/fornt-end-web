// import { Project } from "./project.entity";
// import { Team } from "./team.entity";

// export interface TeamProject{
//     TeamId:number;
//     ProjectId:number;
//     Teams:Team[];
//     Projects:Project[];
// }
import { Project } from "./project.entity";
import { Team } from "./team.entity";

export interface TeamProject {
    TeamId: number;
    ProjectId: number;
    // Si no necesitas las propiedades de navegación, podrías omitirlas:
    Teams?: Team[];
    Projects?: Project[];
}
