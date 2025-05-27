import { Expression } from "./Expression";

export class MoveExpression extends Expression{
    constructor(public readonly actor:string, public readonly target:string){
        super();
    }
}