import { Team } from "./team.entity";
import { User } from "./User.entity";
import { WeeklyScrum } from "./weeklyscrum.entity";

export interface Developer extends User{
    NameSpecialization: string | null;
    Team: Team | null;
    WeeklyScrum: WeeklyScrum | null;
}