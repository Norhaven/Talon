import { Type } from "./Type";
import { Method } from "./Method";

export class Field{
    name:string = "";
    typeName:string = "";
    type?:Type;
    defaultValue?:Object;
}