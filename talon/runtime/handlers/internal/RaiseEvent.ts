import { EventType } from "../../../common/EventType";
import { Instruction } from "../../../common/Instruction";
import { Method } from "../../../common/Method";
import { Type } from "../../../common/Type";
import { BooleanType } from "../../../library/BooleanType";
import { WorldObject } from "../../../library/WorldObject";
import { RuntimeDelegate } from "../../library/RuntimeDelegate";
import { RuntimeWorldObject } from "../../library/RuntimeWorldObject";
import { Variable } from "../../library/Variable";
import { Thread } from "../../Thread";

export class RaiseEvent{
    static contextual(thread:Thread, eventType:EventType, actor:RuntimeWorldObject, target:RuntimeWorldObject):RuntimeDelegate[]{
        
        const actorEvents = Array.from(actor.methods.values()!).filter(x => x.eventType == eventType && x.parameters.length > 0 && x.parameters[0].typeName === target.typeName);
        const targetEvents = Array.from(target.methods.values()!).filter(x => x.eventType == eventType && x.parameters.length > 0 && x.parameters[0].typeName === actor.typeName);

        const actorThis = Variable.forThis(actor);
        const targetThis = Variable.forThis(target);
        
        thread.logInfo?.debug(`Raising ${actorEvents.length} contextual events`);

        const results:RuntimeDelegate[] = [];

        for(const event of actorEvents){
            event.actualParameters = [
                actorThis,
                new Variable(WorldObject.contextParameter, new Type(target.typeName, target.parentTypeName), target)
            ];

            const delegate = new RuntimeDelegate(event);

            results.push(delegate);
        }

        for(const event of targetEvents){
            event.actualParameters = [
                targetThis,
                new Variable(WorldObject.contextParameter, new Type(actor.typeName, actor.parentTypeName), actor)
            ];

            const delegate = new RuntimeDelegate(event);

            results.push(delegate);
        }

        return results;
    }

    static nonContextual(thread:Thread, eventType:EventType, target:RuntimeWorldObject):RuntimeDelegate[]{
        
        const events = Array.from(target.methods.values()!).filter(x => x.eventType == eventType && x.parameters.length === 0);

        thread.writeInfo(`Attempting to raise '${events.length}' non-contextual events for '${eventType}' on '${target.typeName}'...`);

        const results:RuntimeDelegate[] = [];
    
        for(const event of events){

            event.actualParameters = [
                Variable.forThis(target)
            ];

            const delegate = new RuntimeDelegate(event);

            results.push(delegate);      
        }

        return results;
    }
}