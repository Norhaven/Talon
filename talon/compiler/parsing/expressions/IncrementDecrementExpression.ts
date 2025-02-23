import { Expression } from "./Expression";

export class IncrementDecrementExpression extends Expression{
    constructor(public readonly value:number, public readonly variableName:string){
        super();
    }
}