import { Expression } from "./Expression";

export class UnderstandingDeclarationExpression extends Expression{
    constructor(public readonly value:string, public readonly meaning:string){
        super();
    }
}