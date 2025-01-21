import { Developer } from "./developer.entity"
import { ProductOwner } from "./productowner.entity"
import { TeamProject } from "./teamproject.entity";

export interface Team{
    Id: number;
    Name: string;
    Code: string;
    ProductOwner: ProductOwner
    Developers: Developer[];
    TeamProject: TeamProject;
}