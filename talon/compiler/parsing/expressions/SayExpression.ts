import { Expression } from "./Expression";

export class SayExpression extends Expression{
    constructor(public text:string){
        super();
    }
}