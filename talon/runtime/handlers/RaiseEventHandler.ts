import { EventType } from "../../common/EventType";
import { Instruction } from "../../common/Instruction";
import { Method } from "../../common/Method";
import { OpCode } from "../../common/OpCode";
import { Type } from "../../common/Type";
import { BooleanType } from "../../library/BooleanType";
import { Memory } from "../common/Memory";
import { RuntimeDelegate } from "../library/RuntimeDelegate";
import { RuntimeList } from "../library/RuntimeList";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeWorldObject } from "../library/RuntimeWorldObject";
import { Variable } from "../library/Variable";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RaiseEvent } from "./internal/RaiseEvent";

export class RaiseEventHandler extends OpCodeHandler{
    public code: OpCode = OpCode.RaiseEvent;

    handle(thread:Thread){

        let eventType:EventType = <EventType>thread.currentInstruction?.value;

        if (!eventType){
            eventType = <EventType>(<RuntimeString>thread.currentMethod.pop()).value;
        }
        
        const target = <RuntimeWorldObject>thread.currentMethod.pop()!;
        
        this.logInteraction(thread, target.typeName, eventType);

        const eventDelegates = RaiseEvent.nonContextual(thread, eventType, target);
        
        thread.currentMethod.push(new RuntimeList(eventDelegates));
        
        return super.handle(thread);
    }
}