import { EventType } from "../../common/EventType";
import { OpCode } from "../../common/OpCode";
import { Type } from "../../common/Type";
import { WorldObject } from "../../library/WorldObject";
import { Memory } from "../common/Memory";
import { RuntimeDelegate } from "../library/RuntimeDelegate";
import { RuntimeList } from "../library/RuntimeList";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeWorldObject } from "../library/RuntimeWorldObject";
import { Variable } from "../library/Variable";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { Event } from "./internal/Event";

export class RaiseContextualEventHandler extends OpCodeHandler{
    public code: OpCode = OpCode.RaiseContextualEvent;

    handle(thread:Thread){

        let eventType = <EventType>thread.currentInstruction?.value;

        if (eventType == EventType.RuntimeDetermined){
            eventType = <EventType>(<RuntimeString>thread.currentMethod.pop()).value;
        }

        const actor = <RuntimeWorldObject>thread.currentMethod.pop();
        const target = <RuntimeWorldObject>thread.currentMethod.pop();
        
        this.logInteraction(thread, target.typeName, actor.typeName, eventType);

        Event.using(thread).raiseContextual(eventType, actor, target);

        return super.handle(thread);
    }
}