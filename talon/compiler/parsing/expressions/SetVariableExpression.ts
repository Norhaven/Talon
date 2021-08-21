import { Expression } from "./Expression";

export class SetVariableExpression extends Expression{
    constructor(public readonly instanceName:string|undefined,
                public readonly variableName:string, 
                public readonly evaluationExpression:Expression,
                public readonly isNegated:boolean){
        super();
    }
}