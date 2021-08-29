import { Expression } from "./Expression";
import { IdentifierExpression } from "./IdentifierExpression";

export class ReplaceExpression extends Expression{
    constructor(public readonly newEntity:IdentifierExpression,
                public readonly replacedEntities:IdentifierExpression[]){
        super();
    }
}