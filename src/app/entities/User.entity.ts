import { ChangeDetails } from "./changedetails.entity"
import { Developer } from "./developer.entity"
import { ProductOwner } from "./productowner.entity"

export interface User{
    Id:number;
    Rol:boolean;
    Name:string;
    Account:string;
    Password:string;
    ProductOwner:ProductOwner;
    Developer:Developer;
    ChangeDetails:ChangeDetails;
}