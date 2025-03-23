import { EventType } from "../../../common/EventType";
import { WorldObject } from "../../../library/WorldObject";
import { RuntimeAny } from "../../library/RuntimeAny";
import { RuntimeDelegate } from "../../library/RuntimeDelegate";
import { RuntimeMenu } from "../../library/RuntimeMenu";
import { RuntimeMenuOption } from "../../library/RuntimeMenuOption";
import { Variable } from "../../library/Variable";
import { Thread } from "../../Thread";
import { ResolvableEvent } from "./ResolvableEvent";

export class EventResolver{
    constructor(private readonly thread:Thread){

    }

    resolveMenuSelection(menu:RuntimeMenu, selectedOption:RuntimeMenuOption){

        return this.resolveEventDelegates(EventType.OptionIsSelected, menu, selectedOption);
    }  

    
    resolve(eventType:EventType, actor:RuntimeAny, target?:RuntimeAny){

        const actorEvents = this.resolveEventDelegates(eventType, actor, target);
        const targetEvents = this.resolveEventDelegates(eventType, target, actor);
        
        return [...actorEvents, ...targetEvents];
    }

    private resolveInvokableEvents(eventType:EventType, instance:RuntimeAny, context?:RuntimeAny):ResolvableEvent[]{
        
        const events = Array.from(instance.methods.values()).map(x => new ResolvableEvent(instance, x));
        const invokableEvents = events.filter(x => x.canBeInvokedWith(eventType, context));

        const baseEvents = instance.base ? this.resolveInvokableEvents(eventType, instance.base) : [];

        invokableEvents.push(...baseEvents);

        return invokableEvents;
    }

    private resolveOverloadedEvents(eventType:EventType, instance:RuntimeAny, context?:RuntimeAny){

        // Events will be resolved in order of most to least derived, so we need to run them in order
        // and omit explicit virtual method calls to base implementations because those will have already 
        // been taken care of by the overriding call.

        const invokableEvents = this.resolveInvokableEvents(eventType, instance, context);

        const invokedEvents = new Set<string>();

        const convertIfPossible = (event:ResolvableEvent) => {
            if (invokedEvents.has(event.name)){
                return false;
            }

            invokedEvents.add(event.name);
            return true;
        };

        return invokableEvents.filter(convertIfPossible);
    }

    private resolveEventDelegates(eventType:EventType, instance?:RuntimeAny, context?:RuntimeAny){

        if (!instance){
            return [];
        }

        const events = this.resolveOverloadedEvents(eventType, instance, context);
                
        this.thread.logReadable(`Attempting to raise '${events.length}' events for '${eventType}' on '${instance.typeName}'...`);    

        return events.map(x => x.toDelegate(context));
    }
}