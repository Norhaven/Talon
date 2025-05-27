import { ClosureExpression } from "./ClosureExpression";
import { Expression } from "./Expression";
import { LocationConditionExpression } from "./LocationConditionExpression";

export class WhenDeclarationExpression extends Expression{
    constructor(public readonly actor:string,
                public readonly eventKind:string[],
                public readonly actions:Expression,
                public readonly target?:string[],
                public readonly locationConditions?:LocationConditionExpression,
                public readonly closures?:ClosureExpression,
                public readonly comparisonKind?:string,
                public readonly choiceIndex?:number){
        super();
    }
}