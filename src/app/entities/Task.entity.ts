import { ChangeDetails } from "./changedetails.entity";
import { Developer } from "./developer.entity";
import { ProductBacklog } from "./productbacklog.entity";
import { Sprint } from "./sprint.entity";
import { WeeklyScrum } from "./weeklyscrum.entity";

export interface Task{
    Id: number;
    Name: string;
    WeeklyScrum: string;
    Description: string;
    State: number; 
    ChangeDetails: ChangeDetails[];
    Sprint: Sprint;
    ProductBacklog: ProductBacklog;
    weeklyScrums?: WeeklyScrum[];
    Responsible: Developer;
    Order: number;
}