import { EventType } from "../../common/EventType";
import { OpCode } from "../../common/OpCode";
import { Type } from "../../common/Type";
import { WorldObject } from "../../library/WorldObject";
import { Memory } from "../common/Memory";
import { RuntimeDelegate } from "../library/RuntimeDelegate";
import { RuntimeList } from "../library/RuntimeList";
import { RuntimeWorldObject } from "../library/RuntimeWorldObject";
import { Variable } from "../library/Variable";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RaiseEvent } from "./internal/RaiseEvent";

export class RaiseContextualEventHandler extends OpCodeHandler{
    public code: OpCode = OpCode.RaiseContextualEvent;

    handle(thread:Thread){

        const eventType = <EventType>thread.currentInstruction?.value;

        const actor = <RuntimeWorldObject>thread.currentMethod.pop();
        const target = <RuntimeWorldObject>thread.currentMethod.pop();
        
        this.logInteraction(thread, target.typeName, actor.typeName, eventType);

        const eventDelegates = RaiseEvent.contextual(thread, eventType, actor, target);
        
        thread.currentMethod.push(Memory.allocateList(eventDelegates));

        return super.handle(thread);
    }
}