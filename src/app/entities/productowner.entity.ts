import { Team } from "./team.entity";
import { User } from "./User.entity";

export interface ProductOwner extends User{
    StakeHolderContact: string;
    Team: Team;
}