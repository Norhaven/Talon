import { RuntimeAny } from "./RuntimeAny";
import { Instruction } from "../../common/Instruction";
import { Variable } from "./Variable";

export class RuntimeMethod extends RuntimeAny{
    constructor(public name:string, public parameters:Variable[], public returnTypeName:string, public body:Instruction[]){
        super();
    }

    toString(){
        return `${name}(...${this.parameters.length}) -> ${this.returnTypeName}`;
    }
}