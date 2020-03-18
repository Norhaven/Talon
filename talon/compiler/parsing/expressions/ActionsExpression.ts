import { Expression } from "./Expression";

export class ActionsExpression extends Expression{
    constructor(public readonly actions:Expression[]){
        super();
    }
}