import { Expression } from "./Expression";

export class VisibilityExpression extends Expression{
    constructor(public readonly action:string, 
                public readonly target?:string){
        super();
    }
}