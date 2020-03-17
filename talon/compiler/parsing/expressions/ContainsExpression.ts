import { Expression } from "./Expression";

export class ContainsExpression extends Expression{
    constructor(public readonly targetName:string,
                public readonly count:number, 
                public readonly typeName:string){
                    super();
    }
}