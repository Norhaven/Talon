import { Expression } from "./Expression";

export class ClosureExpression extends Expression{
    constructor(public readonly closureSources:string[]){
        super();
    }
}