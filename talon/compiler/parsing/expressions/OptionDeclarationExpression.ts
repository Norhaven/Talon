import { Expression } from "./Expression";

export class OptionDeclarationExpression extends Expression{
    constructor(public readonly optionName:string, public readonly text:string, public readonly actions:Expression[]){
        super();
    }
}