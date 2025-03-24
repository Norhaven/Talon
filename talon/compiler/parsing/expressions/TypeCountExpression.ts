import { Expression } from "./Expression";

export class TypeCountExpression extends Expression{
    constructor(public readonly count:number, public readonly typeName:string){
        super();
    }
}