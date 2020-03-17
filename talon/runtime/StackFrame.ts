import { Variable } from "./library/Variable";
import { Method } from "../common/Method";

export class StackFrame{
    locals:Variable[] = [];
    currentInstruction:number = -1;

    constructor(method:Method){
        for(var parameter of method.parameters){
            const variable = new Variable(parameter.name, parameter.type!);
            this.locals.push(variable);
        }
    }
}