import { Expression } from "./Expression";

export class LiteralExpression extends Expression{
    constructor(public readonly typeName:string, public readonly value:Object){
        super();
    }
}