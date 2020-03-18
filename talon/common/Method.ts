import { Parameter } from "./Parameter";
import { Instruction } from "./Instruction";
import { Variable } from "../runtime/library/Variable";
import { EventType } from "./EventType";

export class Method{
    name:string = "";
    parameters:Parameter[] = [];
    actualParameters:Variable[] = [];
    body:Instruction[] = [];
    returnType:string = "";
    eventType:EventType = EventType.None;
}