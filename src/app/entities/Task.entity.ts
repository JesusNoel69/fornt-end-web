import { ChangeDetails } from "./changedetails.entity";
import { ProductBacklog } from "./ProductBacklog.entity";
import { Sprint } from "./sprint.entity";

export interface Task{
    Id: number;
    Name: string;
    WeeklyScrum: string;
    Description: string;
    State: number; 
    ChangeDetails: ChangeDetails[];
    Sprint: Sprint;
    ProductBacklog: ProductBacklog;
}