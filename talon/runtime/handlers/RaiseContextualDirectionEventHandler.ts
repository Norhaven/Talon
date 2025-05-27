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

export class RaiseContextualDirectionEventHandler extends OpCodeHandler{
    public code: OpCode = OpCode.RaiseContextualDirectionEvent;

    handle(thread:Thread){

        let eventType = <EventType>thread.currentInstruction?.value;

        const actor = <RuntimeWorldObject>thread.currentMethod.pop();
        const target = <RuntimeWorldObject>thread.currentMethod.pop();
        const direction = <RuntimeString>thread.currentMethod.pop();
        
        this.logInteraction(thread, target.typeName, actor.typeName, eventType, direction);

        Event.using(thread).raiseContextualDirection(eventType, actor, target, direction);

        return super.handle(thread);
    }
}