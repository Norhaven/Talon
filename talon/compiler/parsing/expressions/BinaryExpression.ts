import { Expression } from "./Expression";

export class BinaryExpression extends Expression{
    left?:Expression;
    right?:Expression;
}