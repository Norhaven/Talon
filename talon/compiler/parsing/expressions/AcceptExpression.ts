import { inherits } from "util";
import { Expression } from "./Expression";
import { IdentifierExpression } from "./IdentifierExpression";
import { ListExpression } from "./ListExpression";

export class AcceptExpression extends Expression{
    constructor(public readonly targets:IdentifierExpression[]){
        super();
    }
}