import { EventType } from "../../../common/EventType";
import { WorldObject } from "../../../library/WorldObject";
import { RuntimeAny } from "../../library/RuntimeAny";
import { RuntimeDelegate } from "../../library/RuntimeDelegate";
import { RuntimeMenu } from "../../library/RuntimeMenu";
import { RuntimeMenuOption } from "../../library/RuntimeMenuOption";
import { RuntimeString } from "../../library/RuntimeString";
import { Variable } from "../../library/Variable";
import { Thread } from "../../Thread";
import { ResolvableEvent } from "./ResolvableEvent";

export class EventResolver{
    constructor(private readonly thread:Thread){

    }

    resolveMenuSelection(menu:RuntimeMenu, selectedOption:RuntimeMenuOption){

        this.thread.logReadable(`========Resolving menu option '${selectedOption.typeName}'`);

        return this.resolveEventDelegates(EventType.OptionIsSelected, menu, selectedOption);
    }  

    
    resolve(eventType:EventType, actor:RuntimeAny, target?:RuntimeAny, direction?:RuntimeString){

        const actorEvents = this.resolveEventDelegates(eventType, actor, target, direction);
        const targetEvents = this.resolveEventDelegates(eventType, target, actor, direction);
        
        return [...actorEvents, ...targetEvents];
    }

    private resolveInvokableEvents(eventType:EventType, instance:RuntimeAny, context?:RuntimeAny, direction?:RuntimeString):ResolvableEvent[]{
        const events = Array.from(instance.methods.values()).map(x => new ResolvableEvent(this.thread, instance, x));
        const invokableEvents = events.filter(x => x.canBeInvokedWith(eventType, context, direction));

        const baseEvents = instance.base ? this.resolveInvokableEvents(eventType, instance.base, context, direction) : [];

        invokableEvents.push(...baseEvents);

        this.thread.logReadable(`Tried to raise event '${eventType}' on instance '${instance.getType().name}', found '${invokableEvents.length}' invokable events`);

        return invokableEvents;
    }

    private resolveOverloadedEvents(eventType:EventType, instance:RuntimeAny, context?:RuntimeAny, direction?:RuntimeString){

        // Events will be resolved in order of most to least derived, so we need to run them in order
        // and omit explicit virtual method calls to base implementations because those will have already 
        // been taken care of by the overriding call.

        const invokableEvents = this.resolveInvokableEvents(eventType, instance, context, direction);

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

    private resolveEventDelegates(eventType:EventType, instance?:RuntimeAny, context?:RuntimeAny, direction?:RuntimeString){

        if (!instance){
            return [];
        }

        const events = this.resolveOverloadedEvents(eventType, instance, context, direction);
                
        this.thread.logReadable(`Attempting to raise '${events.length}' events for '${eventType}' on '${instance.typeName}'...`);    

        return events.map(x => x.toDelegate(context));
    }
}