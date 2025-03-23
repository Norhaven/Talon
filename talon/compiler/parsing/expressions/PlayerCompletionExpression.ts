import { EventType } from "../../../common/EventType";
import { Expression } from "./Expression";

export class PlayerCompletionExpression extends Expression{
    constructor(public readonly action:EventType){
        super();
    }
}