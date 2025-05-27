import { Expression } from "./Expression";

export class IncrementDecrementExpression extends Expression{
    constructor(public readonly value:number, public readonly instanceName:string|null, public readonly variableName:string){
        super();
    }
}