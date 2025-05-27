import { Expression } from "./Expression";
import { IdentifierExpression } from "./IdentifierExpression";

export class SetVariableExpression extends Expression{
    constructor(public readonly variableIdentifier:IdentifierExpression,
                public readonly evaluationExpression:Expression,
                public readonly isNegated:boolean){
        super();
    }
}