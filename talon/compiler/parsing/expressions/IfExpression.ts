import { Expression } from "./Expression";

export class IfExpression extends Expression{
    constructor(public readonly conditional:Expression,
                public readonly ifBlock:Expression,
                public readonly elseBlock:Expression|null){
                    super();
                }
}