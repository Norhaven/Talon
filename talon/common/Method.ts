import { Parameter } from "./Parameter";
import { Instruction } from "./Instruction";
import { Variable } from "../runtime/library/Variable";

export class Method{
    name:string = "";
    parameters:Parameter[] = [];
    actualParameters:Variable[] = [];
    body:Instruction[] = [];
    returnType:string = "";
}