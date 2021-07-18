import { Expression } from "./Expression";

export class WhenDeclarationExpression extends Expression{
    constructor(public readonly actor:string,
                public readonly eventKind:string,
                public readonly actions:Expression,
                public readonly target?:string){
        super();
    }
}