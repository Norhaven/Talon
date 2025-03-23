import { BinaryExpression } from "./BinaryExpression";
import { Expression } from "./Expression";
import { IdentifierExpression } from "./IdentifierExpression";

export class ComparisonExpression extends BinaryExpression{
    constructor(identifier:IdentifierExpression, comparedTo:Expression, public readonly isNegated:boolean){
        super();
        this.left = identifier;
        this.right = comparedTo;
    }
}