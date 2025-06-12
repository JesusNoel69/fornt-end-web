export interface TaskCreateDto
{
    Name: string;
    Description: string;
    WeeklyScrum: string;
    State: number;
    Order: number;
    SprintId: number | null;
    ProductBacklogId: number;
    DeveloperId: number;
}