import { EventType } from "../../../common/EventType";
import { Item } from "../../../library/Item";
import { WorldObject } from "../../../library/WorldObject";
import { Memory } from "../../common/Memory";
import { RuntimeError } from "../../errors/RuntimeError";
import { IOutput } from "../../IOutput";
import { RuntimeAny } from "../../library/RuntimeAny";
import { RuntimeDelegate } from "../../library/RuntimeDelegate";
import { RuntimePlace } from "../../library/RuntimePlace";
import { RuntimeWorldObject } from "../../library/RuntimeWorldObject";
import { Variable } from "../../library/Variable";
import { Thread } from "../../Thread";
import { Lookup } from "./Lookup";
import { RaiseEvent } from "./RaiseEvent";

export class Action{
    static using(thread:Thread, actor:RuntimeWorldObject|undefined, target:RuntimeWorldObject, output:IOutput){
        return new Action(thread, actor, target, output);
    }

    private constructor(
        private readonly thread:Thread, 
        private readonly actor:RuntimeWorldObject|undefined, 
        private readonly target:RuntimeWorldObject,
        private readonly output:IOutput){

    }

    tryDescribeTarget(){
        const describe = this.target.methods.get(WorldObject.describe)!;
        describe.actualParameters.unshift(Variable.forThis(this.target));

        this.addDelegates(new RuntimeDelegate(describe));
    }

    tryDescribeTargetContents(){
        const event = this.prepareDescribeContents(this.target);

        this.addDelegates(event);
    }

    tryMoveToTarget(){
        const nextPlace = <RuntimePlace>this.target;
        const currentPlace = this.thread.currentPlace;

        this.thread.currentPlace = nextPlace;
        
        const describeEvent = this.createDescribeDelegate(this.target);
        const nextPlaceEvent = this.prepareRaiseEvent(EventType.PlayerEntersPlace, nextPlace);
        const currentPlaceEvent = this.prepareRaiseEvent(EventType.PlayerExitsPlace, currentPlace!);
                
        const allDelegates = [
            ...currentPlaceEvent,
            ...nextPlaceEvent,
            describeEvent
        ];

        this.thread.logReadable(`Moving with ${allDelegates.length} events to be raised`);

        this.addDelegates(...allDelegates);            
    }

    tryTakeTarget(){
        if (!this.target.isTypeOf(Item.typeName)){
            this.output.write("I can't take that.");
            this.thread.logReadable(`Unable to take '${this.target.typeName}:${this.target.parentTypeName}', not an item`);
            
            this.addDelegates();            
            return;
        }

        const [_, item] = Lookup.findTargetByNameIn(this.thread, this.thread.currentPlace!, this.target.typeName, true);

        const inventory = this.thread.currentPlayer!.getContentsField();
        inventory.items.push(item!);

        const describeEvent = this.createDescribeDelegate(this.thread.currentPlace!);                
        const takeEvent = this.prepareRaiseEvent(EventType.ItIsTaken, this.target);                

        this.addDelegates(...takeEvent, describeEvent);
    }

    tryDropItemTarget(){
        const [_, item] = Lookup.findTargetByNameIn(this.thread, this.thread.currentPlayer!, this.target.typeName, true);

        if (!item){
            throw new RuntimeError(`Unable to locate item '${this.target.typeName}' to drop`);
        }

        if (!this.thread.currentPlace){
            throw new RuntimeError(`Unable to drop an item without a current place`);
        }

        const contents = this.thread.currentPlace!.getContentsField();

        console.log(`CONTENTS ARE ${contents}`);

        contents.items.push(item);

        const describeEvent = this.createDescribeDelegate(this.thread.currentPlace!);                
        const event = this.prepareRaiseEvent(EventType.ItIsDropped, this.target);

        this.thread.currentMethod.push(Memory.allocateList([...event, describeEvent]));
    }

    tryUseTarget(){
        if (this.actor){
            const contextual = this.prepareRaiseContextualItemEvents(EventType.ItIsUsed, this.actor, this.target);
            const event = this.prepareRaiseEvent(EventType.ItIsUsed, this.actor);

            this.addDelegates(...event, ...contextual);
        } else {
            this.raiseEvent(EventType.ItIsUsed, this.target);
        }
    }

    tryOpenTarget(){
        this.raiseEvent(EventType.ItIsOpened, this.target);
    }

    tryCloseTarget(){
        this.raiseEvent(EventType.ItIsClosed, this.target);
    }

    tryCombineTarget(){
        if (this.actor){
            const contextual = this.prepareRaiseContextualItemEvents(EventType.ItIsCombined, this.actor, this.target);
            const event1 = this.prepareRaiseEvent(EventType.ItIsCombined, this.actor);
            const event2 = this.prepareRaiseEvent(EventType.ItIsCombined, this.target); 

            this.addDelegates(...event1, ...event2, ...contextual);
        } else {
            this.raiseEvent(EventType.ItIsCombined, this.target);
        }
    }

    tryGiveToTarget(){
        if (!this.actor){
            this.output.write(`Unable to give an unknown object!`)
            return;
        }

        if (!this.target){
            this.output.write(`Unable to give your ${this.actor.typeName} to nothing!`);
            return;
        }

        const playerContents = this.thread.currentPlayer?.getContentsField();
        const contents = this.target.getContentsField();

        playerContents?.removeInstance(this.actor);
        contents.items.push(this.actor);
            
        const events = this.prepareRaiseContextualItemEvents(EventType.ItIsGiven, this.actor, this.target);

        this.addDelegates(...events);            
    }

    private prepareRaiseContextualItemEvents(type:EventType, actor:RuntimeAny, target:RuntimeAny){
        if (!(actor instanceof RuntimeWorldObject)){
            throw new RuntimeError(`Attempted to raise a contextual event on a non-world-object actor instance of type '${actor.typeName}'`);
        }

        if (!(target instanceof RuntimeWorldObject)){
            throw new RuntimeError(`Attempted to raise an event on a non-world-object instance of type '${target.typeName}'`);
        }
        
        return RaiseEvent.contextual(this.thread, type, actor, target);
    }

    private raiseEvent(type:EventType, target:RuntimeAny){                
        const eventDelegates = this.prepareRaiseEvent(type, target);

        this.addDelegates(...eventDelegates);
    }

    private prepareDescribeContents(describableContainer:RuntimeAny){
        if (!(describableContainer instanceof RuntimeWorldObject)){
            throw new RuntimeError(`Attempted to describe contents on a non-world-object instance of type '${describableContainer.typeName}'`);
        }

        const describeContents = describableContainer.methods.get(WorldObject.describeContents);

        if (!describeContents){
            throw new RuntimeError(`Unable to locate ${WorldObject.describeContents} on world object`);
        }

        describeContents.actualParameters[0] = Variable.forThis(describableContainer);

        return new RuntimeDelegate(describeContents);
    }
    
    private prepareRaiseEvent(type:EventType, target:RuntimeAny){
        if (!(target instanceof RuntimeWorldObject)){
            throw new RuntimeError(`Attempted to raise an event on a non-world-object instance of type '${target.typeName}'`);
        }

        return RaiseEvent.nonContextual(this.thread, type, target);
    }

    private addDelegates(...delegates:RuntimeDelegate[]){
        if (delegates?.length == 1){
            this.thread.currentMethod.push(delegates[0]);
        } else if (delegates?.length > 1){      
            this.thread.currentMethod.push(Memory.allocateList(delegates));
        } else {
            this.thread.currentMethod.push(Memory.allocateList([]));
        }
    }

    private createDescribeDelegate(describableObject:RuntimeWorldObject){
        const describe = describableObject.methods.get(WorldObject.describe)!;
        describe.actualParameters.unshift(Variable.forThis(this.target));

        return new RuntimeDelegate(describe);
    }
}