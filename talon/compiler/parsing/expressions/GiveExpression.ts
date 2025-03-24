import { Expression } from "./Expression";
import { TypeCountExpression } from "./TypeCountExpression";

export class GiveExpression extends Expression{
    constructor(public readonly targetName:string, public readonly items:TypeCountExpression[]){
        super();
    }
}