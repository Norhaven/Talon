import { Expression } from "./Expression";

export class LocationConditionExpression extends Expression{
    constructor(public readonly locationNames:string[]){
        super();
    }
}