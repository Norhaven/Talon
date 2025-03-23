import { EventType } from "../../../common/EventType";
import { Type } from "../../../common/Type";
import { Group } from "../../../library/Group";
import { Item } from "../../../library/Item";
import { StringType } from "../../../library/StringType";
import { WorldObject } from "../../../library/WorldObject";
import { Memory } from "../../common/Memory";
import { RuntimeError } from "../../errors/RuntimeError";
import { IOutput } from "../../IOutput";
import { RuntimeAny } from "../../library/RuntimeAny";
import { RuntimeDelegate } from "../../library/RuntimeDelegate";
import { RuntimeGroup } from "../../library/RuntimeGroup";
import { RuntimePlace } from "../../library/RuntimePlace";
import { RuntimeWorldObject } from "../../library/RuntimeWorldObject";
import { Variable } from "../../library/Variable";
import { Thread } from "../../Thread";
import { ActionContext } from "./ActionContext";
import { Lookup } from "./Lookup";
import { Event } from "./Event";

export class Action{
    static using(thread:Thread, context:ActionContext, output:IOutput){
        return new Action(thread, context, output);
    }

    get actorSource(){
        return this.context.actorSource;
    }

    get targetSource(){
        return this.context.targetSource;
    }

    get actor(){
        return this.context.actor;
    }

    get target(){
        return this.context.target;
    }

    private constructor(
        private readonly thread:Thread, 
        private readonly context:ActionContext,
        private readonly output:IOutput){

    }

    tryDescribe(){
        this.tryAct("describe", (actorSource, actor) => {
            const describe = actorSource.methods.get(WorldObject.describe)!;
            describe.actualParameters = [Variable.forThis(actor)];
    
            Event.using(this.thread).raiseAll(new RuntimeDelegate(describe));
        });        
    }

    tryDescribeContents(){
        this.tryAct("describe contents", (actorSource, actor) => {
            const event = this.prepareDescribeContents(actor);

            Event.using(this.thread).raiseAll(event);
        });        
    }

    tryMove(){
        this.tryActWithTarget("move", (actorSource, actor, targetSource, target) => {
            const nextPlace = <RuntimePlace>target;
            const currentPlace = targetSource;
    
            this.thread.currentPlace = nextPlace;
            
            const describeEvent = this.createDescribeDelegate(target);
            const nextPlaceEvent = this.prepareRaiseEvent(EventType.PlayerEntersPlace, nextPlace);
            const currentPlaceEvent = this.prepareRaiseEvent(EventType.PlayerExitsPlace, currentPlace!);
                    
            const allDelegates = [
                ...currentPlaceEvent,
                ...nextPlaceEvent,
                describeEvent
            ];
    
            this.thread.logReadable(`Moving with ${allDelegates.length} events to be raised`);
    
            Event.using(this.thread).raiseAll(...allDelegates);
        });  
    }

    tryTake(){
        this.tryActWithTarget("take", (actorSource, actor, targetSource, target) => {
            if (!actor.isTypeOf(Item.typeName) && !actor.isTypeOf(Group.typeName)){
                this.output.write("I can't take that.");
                this.thread.logReadable(`Unable to take '${actor.typeName}:${actor.parentTypeName}', not an item or group of items`);
                
                Event.using(this.thread).raiseEmpty();
                return;
            }
    
            this.transfer(actorSource, actor, targetSource, target, EventType.ItIsTaken);
        });
    }

    tryDropItem(){
        this.tryActWithTarget("drop", (actorSource, actor, targetSource, target) => {            
            this.transfer(actorSource, actor, targetSource, target, EventType.ItIsDropped);
        });             
    }

    tryUse(){        
        this.tryAct("use", (actorSource, actor) => {
            if (this.target){
                const contextual = this.prepareRaiseContextualItemEvents(EventType.ItIsUsed, actor, this.target);
                const event = this.prepareRaiseEvent(EventType.ItIsUsed, actor);
    
                Event.using(this.thread).raiseAll(...event, ...contextual);
            } else {
                Event.using(this.thread).raiseNonContextual(EventType.ItIsUsed, actor);
            }
        });
    }

    tryOpen(){
        this.tryAct("open", (actorSource, actor) => {
            Event.using(this.thread).raiseNonContextual(EventType.ItIsOpened, actor);
        });
    }

    tryClose(){
        this.tryAct("close", (actorSource, actor) => {
            Event.using(this.thread).raiseNonContextual(EventType.ItIsClosed, actor);
        });
    }

    tryCombine(){
        this.tryAct("combine", (actorSource, actor) => {
            if (this.target){
                const contextual = this.prepareRaiseContextualItemEvents(EventType.ItIsCombined, actor, this.target);
                const event1 = this.prepareRaiseEvent(EventType.ItIsCombined, actor);
                const event2 = this.prepareRaiseEvent(EventType.ItIsCombined, this.target); 
    
                Event.using(this.thread).raiseAll(...event1, ...event2, ...contextual);
            } else {
                Event.using(this.thread).raiseNonContextual(EventType.ItIsCombined, actor);
            }
        });        
    }

    tryGive(){
        this.tryActWithTarget("give", (actorSource, actor, targetSource, target) => {
            this.transfer(actorSource, actor, targetSource, target, EventType.ItIsGiven);
        });    
    }

    private tryAct(actionName:string, act:(actorSource:RuntimeWorldObject, actor:RuntimeWorldObject)=>void){
        if (!this.actor || !this.actorSource){
            this.output.write("I'm not quite sure how to do that.");
            this.thread.logReadable(`Unable to '${actionName}', missing an actor source or an actor`);
            Event.using(this.thread).raiseEmpty();
            return;
        }

        act(this.actorSource, this.actor);
    }

    private tryActWithTarget(actionName:string, act:(actorSource:RuntimeWorldObject, actor:RuntimeWorldObject, targetSource:RuntimeWorldObject, target:RuntimeWorldObject)=>void){
        if (!this.actor || !this.actorSource || !this.target || !this.targetSource){
            this.output.write("I'm not quite sure how to do that.");
            this.thread.logReadable(`Unable to '${actionName}', missing an actor source, actor, target source, or target`);
            Event.using(this.thread).raiseEmpty();
            return;
        }

        act(this.actorSource, this.actor, this.targetSource, this.target);
    }

    private transfer(actorSource:RuntimeWorldObject, actor:RuntimeWorldObject, targetSource:RuntimeWorldObject, target:RuntimeWorldObject, eventType:EventType){
        const transferMethod = actorSource.methods.get(WorldObject.transferContents);

        if (!transferMethod){
            throw new RuntimeError(`Unable to transfer '${actor.typeName}' from '${actorSource.typeName}' to '${target.typeName}', could not find transfer method!`);
        }
        
        transferMethod.actualParameters = [
            Variable.forThis(actorSource),
            new Variable(WorldObject.recipientParameter, new Type(target.typeName, target.parentTypeName), this.target),
            new Variable(WorldObject.contextParameter, new Type(actor.typeName, actor.parentTypeName), this.actor),
            new Variable(WorldObject.eventTypeParameter, StringType.type(), Memory.allocateString(eventType))
        ];

        const delegate = new RuntimeDelegate(transferMethod);

        Event.using(this.thread).raiseAll(delegate);    
    }

    private prepareRaiseContextualItemEvents(type:EventType, actor:RuntimeAny, target:RuntimeAny){
        if (!(actor instanceof RuntimeWorldObject)){
            throw new RuntimeError(`Attempted to raise a contextual event on a non-world-object actor instance of type '${actor.typeName}'`);
        }

        if (!(target instanceof RuntimeWorldObject)){
            throw new RuntimeError(`Attempted to raise an event on a non-world-object instance of type '${target.typeName}'`);
        }
        
        return Event.using(this.thread).prepareContextual(type, actor, target);
    }

    private prepareDescribeContents(describableContainer:RuntimeAny){
        if (!(describableContainer instanceof RuntimeWorldObject)){
            throw new RuntimeError(`Attempted to describe contents on a non-world-object instance of type '${describableContainer.typeName}'`);
        }

        const describeContents = describableContainer.methods.get(WorldObject.listContents);

        if (!describeContents){
            throw new RuntimeError(`Unable to locate ${WorldObject.listContents} on world object`);
        }

        describeContents.actualParameters[0] = Variable.forThis(describableContainer);

        return new RuntimeDelegate(describeContents);
    }
    
    private prepareRaiseEvent(type:EventType, target:RuntimeAny){
        if (!(target instanceof RuntimeWorldObject)){
            throw new RuntimeError(`Attempted to raise an event on a non-world-object instance of type '${target.typeName}'`);
        }

        return Event.using(this.thread).prepareNonContextual(type, target);
    }

    private createDescribeDelegate(describableObject:RuntimeWorldObject){
        const describe = describableObject.methods.get(WorldObject.describe)!;
        describe.actualParameters.unshift(Variable.forThis(describableObject));

        return new RuntimeDelegate(describe);
    }
}