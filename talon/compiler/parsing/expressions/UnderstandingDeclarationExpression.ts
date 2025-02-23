import { Expression } from "./Expression";

export class UnderstandingDeclarationExpression extends Expression{
    constructor(public readonly values:string[], public readonly meaning:string){
        super();
    }
}