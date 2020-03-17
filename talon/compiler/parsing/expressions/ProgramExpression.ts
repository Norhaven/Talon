import { Expression } from "./Expression";

export class ProgramExpression extends Expression{
    constructor(readonly expressions:Expression[]){
        super();
    }
}