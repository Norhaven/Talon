import { Expression } from "./Expression";

export class RemoveExpression extends Expression{
    constructor(public readonly actor:string, public readonly target:string){
        super();
    }
}