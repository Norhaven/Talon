import { EventType } from "../../../common/EventType";
import { RuntimeAny } from "../../library/RuntimeAny";
import { RuntimeString } from "../../library/RuntimeString";

export class OverloadContext{

    constructor(public readonly eventType:EventType, public readonly eventContext?:RuntimeAny, public readonly eventDirection?:RuntimeString){
        
    }
}