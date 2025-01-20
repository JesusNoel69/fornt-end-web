import { Team } from "./team.entity";
import { User } from "./User.entity";

export interface Developer extends User{
    NameSpecialization: string | null;
    Team: Team | null;
}