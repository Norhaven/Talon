import { Expression } from "./Expression";

export class IdentifierExpression extends Expression{
    constructor(public readonly instanceName:string|undefined,
                public readonly variableName:string){
        super();
    }
}