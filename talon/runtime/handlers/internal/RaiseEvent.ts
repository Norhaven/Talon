import { EventType } from "../../../common/EventType";
import { Instruction } from "../../../common/Instruction";
import { Method } from "../../../common/Method";
import { Parameter } from "../../../common/Parameter";
import { Type } from "../../../common/Type";
import { BooleanType } from "../../../library/BooleanType";
import { WorldObject } from "../../../library/WorldObject";
import { RuntimeAny } from "../../library/RuntimeAny";
import { RuntimeDelegate } from "../../library/RuntimeDelegate";
import { RuntimeString } from "../../library/RuntimeString";
import { RuntimeWorldObject } from "../../library/RuntimeWorldObject";
import { Variable } from "../../library/Variable";
import { Thread } from "../../Thread";

export class RaiseEvent{
    static contextual(thread:Thread, eventType:EventType, actor:RuntimeAny, target:RuntimeAny):RuntimeDelegate[]{
        const methodNameIsMatch = (method:Method, value:string) => {
            const parts = method.name.split('_');
            const eventValue = parts[parts.length - 1];
            return eventValue.toLowerCase() === value.toLowerCase();
        }
        const methodValueIsMatch = (method:Method, value?:RuntimeAny) => value instanceof RuntimeString ? methodNameIsMatch(method, value.value) : true;
        const contextParameterIsMatch = (method:Method, typeName:string) => method.parameters[0].typeName === typeName;
        const hasParameters = (method:Method) => method.parameters.length > 0;
        const parametersAreMatch = (method:Method, typeName:string) => hasParameters(method) && contextParameterIsMatch(method, typeName);
        const methodIsMatch = (method:Method, typeName:string) => method.eventType == eventType && methodValueIsMatch(method, target) && parametersAreMatch(method, typeName);

        const actorEvents = Array.from(actor.methods.values()!).filter(x => methodIsMatch(x, target.typeName));
        const targetEvents = Array.from(target.methods.values()!).filter(x => methodIsMatch(x, actor.typeName));

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