import { Expression } from "./Expression";

export class SetPlayerExpression extends Expression{
    constructor(public readonly playerType:string){
        super();
    }
}