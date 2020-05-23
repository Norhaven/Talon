import { Expression } from "./Expression";

export class ListExpression extends Expression{
    constructor(public items:Expression[]){
        super();
    }
}