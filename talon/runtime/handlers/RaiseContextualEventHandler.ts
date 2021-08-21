import { EventType } from "../../common/EventType";
import { OpCode } from "../../common/OpCode";
import { Type } from "../../common/Type";
import { WorldObject } from "../../library/WorldObject";
import { RuntimeDelegate } from "../library/RuntimeDelegate";
import { RuntimeWorldObject } from "../library/RuntimeWorldObject";
import { Variable } from "../library/Variable";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class RaiseContextualEventHandler extends OpCodeHandler{
    public code: OpCode = OpCode.RaiseContextualEvent;

    constructor(private eventType?:EventType){
        super();
    }

    handle(thread:Thread){

        if (!this.eventType){
            this.eventType = <EventType>thread.currentInstruction?.value;
        }

        const actor = <RuntimeWorldObject>thread.currentMethod.pop();
        const target = <RuntimeWorldObject>thread.currentMethod.pop();
        
        this.logInteraction(thread, target.typeName, actor.typeName, this.eventType);

        const actorEvents = Array.from(actor.methods.values()!).filter(x => x.eventType == this.eventType && x.parameters.length > 0 && x.parameters[0].typeName === target.typeName);
        const targetEvents = Array.from(target.methods.values()!).filter(x => x.eventType == this.eventType && x.parameters.length > 0 && x.parameters[0].typeName === actor.typeName);

        const actorThis = Variable.forThis(new Type(actor.typeName, actor.parentTypeName), actor);
        const targetThis = Variable.forThis(new Type(target.typeName, target.parentTypeName), target);
        
        for(const event of actorEvents){
            event.actualParameters = [
                actorThis,
                new Variable(WorldObject.contextParameter, new Type(target.typeName, target.parentTypeName), target)
            ];

            const delegate = new RuntimeDelegate(event);

            thread.currentMethod.push(delegate);
        }

        for(const event of targetEvents){
            event.actualParameters = [
                targetThis,
                new Variable(WorldObject.contextParameter, new Type(actor.typeName, actor.parentTypeName), actor)
            ];

            const delegate = new RuntimeDelegate(event);

            thread.currentMethod.push(delegate);
        }

        return super.handle(thread);
    }
}