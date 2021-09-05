import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeCommand } from "../library/RuntimeCommand";
import { RuntimeError } from "../errors/RuntimeError";
import { Understanding } from "../../library/Understanding";
import { RuntimeUnderstanding } from "../library/RuntimeUnderstanding";
import { Meaning } from "../library/Meaning";
import { RuntimeWorldObject } from "../library/RuntimeWorldObject";
import { WorldObject } from "../../library/WorldObject";
import { IOutput } from "../IOutput";
import { RuntimeString } from "../library/RuntimeString";
import { Memory } from "../common/Memory";
import { RuntimeList } from "../library/RuntimeList";
import { RuntimePlace } from "../library/RuntimePlace";
import { Type } from "../../common/Type";
import { RuntimeAny } from "../library/RuntimeAny";
import { Player } from "../../library/Player";
import { RuntimePlayer } from "../library/RuntimePlayer";
import { LoadPropertyHandler } from "./LoadPropertyHandler";
import { PrintHandler } from "./PrintHandler";
import { InstanceCallHandler } from "./InstanceCallHandler";
import { EventType } from "../../common/EventType";
import { RuntimeDelegate } from "../library/RuntimeDelegate";
import { Variable } from "../library/Variable";
import { RuntimeItem } from "../library/RuntimeItem";
import { OpCode } from "../../common/OpCode";
import { Instruction } from "../../common/Instruction";
import { RuntimeEmpty } from "../library/RuntimeEmpty";
import { States } from "../../common/States";
import { RaiseEventHandler } from "./RaiseEventHandler";
import { Item } from "../../library/Item";
import { RaiseContextualEventHandler } from "./RaiseContextualEventHandler";
import { EvaluationResult } from "../EvaluationResult";
import { Method } from "../../common/Method";
import { BooleanType } from "../../library/BooleanType";
import { List } from "../../library/List";
import { RaiseEvent } from "./internal/RaiseEvent";
import { Lookup } from "./internal/Lookup";
import { GlobalEvents } from "../../library/GlobalEvents";

export class HandleCommandHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.HandleCommand;

    private readonly endOfInteraction = "=========END OF INTERACTION=========";

    constructor(private readonly output:IOutput){
        super();
    }

    tryGetUnderstandingFromAction(thread:Thread, action:string){
        const findValueForActionField = (type:Type) => type.fields.find(field => field.name === Understanding.action)?.defaultValue!;
        const getActionUnderstandingPair = (type:Type):readonly [Object, Type] => [findValueForActionField(type), type];
        
        const understandingActionPairs = thread.knownUnderstandings.map(getActionUnderstandingPair);
        const understandingsByAction = new Map<Object, Type>(understandingActionPairs);

        return understandingsByAction.get(action);
    }

    private getMeaningFromUnderstanding(understanding:Type){        
        const meaningField = understanding.fields.find(x => x.name == Understanding.meaning);
        const action = <string>meaningField?.defaultValue;
        const systemAction = `~${action}`;

        switch(systemAction){
            case Understanding.describing: return Meaning.Describing;
            case Understanding.moving: return Meaning.Moving;
            case Understanding.direction: return Meaning.Direction;
            case Understanding.taking: return Meaning.Taking;
            case Understanding.inventory: return Meaning.Inventory;
            case Understanding.dropping: return Meaning.Dropping;
            case Understanding.using: return Meaning.Using;
            case Understanding.opening: return Meaning.Opening;
            case Understanding.closing: return Meaning.Closing;
            case Understanding.observing: return Meaning.Observing;
            case Understanding.combining: return Meaning.Combining;
            case Understanding.options: return Meaning.Pressing;
            default:
                return Meaning.Custom;
        }
    }

    handle(thread:Thread){
        
        const command = thread.currentMethod.pop();

        if (!(command instanceof RuntimeCommand)){
            throw new RuntimeError(`Unable to handle a non-command, found '${command}`);
        }

        const action = command.action!.value;
        const actorName = command.actorName?.value;
        const targetName = command.targetName?.value;

        this.logInteraction(thread, `'${action} ${actorName} ${targetName}'`);

        const understanding = this.tryGetUnderstandingFromAction(thread, action);

        if (!understanding){
            thread.currentMethod.push(Memory.allocateList([]));
            thread.writeInfo(this.endOfInteraction);
            return super.handle(thread);
        }

        const meaning = this.getMeaningFromUnderstanding(understanding);

        if (meaning === Meaning.Pressing){
            return this.handleKeyPress(thread, understanding);
        } else {
            const actualActor = this.inferTargetFrom(thread, actorName, understanding, meaning);
            const actualTarget = this.inferTargetFrom(thread, targetName, understanding, meaning);
            
            if (!actualTarget){                
                this.output.write("I don't know what you're referring to.");
                thread.writeInfo(this.endOfInteraction);
                thread.currentMethod.push(Memory.allocateList([]));

                return super.handle(thread);
            }

            return this.handleCommand(thread, meaning, actualActor, actualTarget);
        }
    }

    private createDescribeDelegate(thread:Thread, target:RuntimeWorldObject){
        const describe = target.methods.get(WorldObject.describe)!;
        describe.actualParameters.unshift(Variable.forThis(target));

        return new RuntimeDelegate(describe);
    }

    private addCallToDescribe(thread:Thread, target:RuntimeWorldObject){
        const delegate = this.createDescribeDelegate(thread, target);

        thread.currentMethod.push(delegate);
    }

    private moveToNextPlace(thread:Thread, target:RuntimeWorldObject){
        const nextPlace = <RuntimePlace>target;
        const currentPlace = thread.currentPlace;

        thread.currentPlace = nextPlace;
        
        const delegate = this.createDescribeDelegate(thread, target);
        const delegates = this.prepareRaiseEvent(thread, EventType.PlayerEntersPlace, nextPlace);
        const delegates1 = this.prepareRaiseEvent(thread, EventType.PlayerExitsPlace, currentPlace!);
             
        const allDelegates = [
            ...delegates1,
            ...delegates,
            delegate
        ];

        thread.writeInfo(`Moving with ${allDelegates.length} events to be raised`);

        thread.currentMethod.push(Memory.allocateList(allDelegates));
    }

    private tryTakeItem(thread:Thread, target:RuntimeWorldObject){
        if (!target.isTypeOf(Item.typeName)){
            this.output.write("I can't take that.");
            thread.writeInfo(`Unable to take '${target.typeName}:${target.parentTypeName}', not an item`);
            return;
        }

        const [_, item] = Lookup.findTargetByNameIn(thread, thread.currentPlace!, target.typeName, true);

        const inventory = thread.currentPlayer!.getContentsField();
        inventory.items.push(item!);

        const describeEvent = this.createDescribeDelegate(thread, thread.currentPlace!);                
        const takeEvent = this.prepareRaiseEvent(thread, EventType.ItIsTaken, target);                

        thread.currentMethod.push(Memory.allocateList([...takeEvent, describeEvent]))
    }
    
    private tryDropItem(thread:Thread, target:RuntimeWorldObject){
        const [_, item] = Lookup.findTargetByNameIn(thread, thread.currentPlayer!, target.typeName, true);

        if (!item){
            throw new RuntimeError(`Unable to locate item '${target.typeName}' to drop`);
        }

        if (!thread.currentPlace){
            throw new RuntimeError(`Unable to drop an item without a current place`);
        }

        const contents = thread.currentPlace!.getContentsField();

        console.log(`CONTENTS ARE ${contents}`);
        
        contents.items.push(item);

        const describeEvent = this.createDescribeDelegate(thread, thread.currentPlace!);                
        const event = this.prepareRaiseEvent(thread, EventType.ItIsDropped, target);

        thread.currentMethod.push(Memory.allocateList([...event, describeEvent]));
    }

    private handleKeyPress(thread:Thread, understanding:Type){
        const key = <string>understanding.fields.find(x => x.name === Understanding.action)?.defaultValue;
        const keyString = Memory.allocateString(key);
        keyString.typeName = key;

        const event = RaiseEvent.contextual(thread, EventType.KeyIsPressed, thread.currentPlace!, keyString);

        const globalWhen = Memory.findOrAddInstance(GlobalEvents.typeName);
        
        const event1 = RaiseEvent.contextual(thread, EventType.KeyIsPressed, globalWhen, keyString);

        thread.currentMethod.push(Memory.allocateList([...event, ...event1]));
        
        return super.handle(thread);
    }

    private handleCommand(thread:Thread, meaning:Meaning, actor:RuntimeWorldObject|undefined, target:RuntimeWorldObject){
        switch(meaning){
            case Meaning.Describing:{
                this.addCallToDescribe(thread, target);
                break;
            }
            case Meaning.Moving: {    
                this.moveToNextPlace(thread, target);
                break;
            }
            case Meaning.Taking: {
                this.tryTakeItem(thread, target);
                break;
            }
            case Meaning.Inventory:{
                const event = this.prepareDescribeContents(thread, target);
                thread.currentMethod.push(Memory.allocateList([event]));           
                break;
            }
            case Meaning.Dropping:{
                this.tryDropItem(thread, target);
                break;
            }
            case Meaning.Using:{
                if (actor){
                    const contextual = this.prepareRaiseContextualItemEvents(thread, EventType.ItIsUsed, actor, target);
                    const event = this.prepareRaiseEvent(thread, EventType.ItIsUsed, actor);

                    thread.currentMethod.push(Memory.allocateList([...event, ...contextual]));
                } else {
                    this.raiseEvent(thread, EventType.ItIsUsed, target);
                }

                break;
            }
            case Meaning.Opening:{
                this.raiseEvent(thread, EventType.ItIsOpened, target);
                break;
            }
            case Meaning.Closing:{
                this.raiseEvent(thread, EventType.ItIsClosed, target);
                break;
            }
            case Meaning.Combining:{
                
                if (actor){
                    const contextual = this.prepareRaiseContextualItemEvents(thread, EventType.ItIsCombined, actor, target);
                    const event1 = this.prepareRaiseEvent(thread, EventType.ItIsCombined, actor);
                    const event2 = this.prepareRaiseEvent(thread, EventType.ItIsCombined, target); 

                    thread.currentMethod.push(Memory.allocateList([...event1, ...event2, ...contextual]));
                } else {
                    this.raiseEvent(thread, EventType.ItIsCombined, target);
                }

                break;
            }            
            default:
                throw new RuntimeError("Unsupported meaning found");
        }  

        thread.writeInfo(this.endOfInteraction);

        return super.handle(thread);
    }

    private prepareDescribeContents(thread:Thread, target:RuntimeAny){
        if (!(target instanceof RuntimeWorldObject)){
            throw new RuntimeError(`Attempted to describe contents on a non-world-object instance of type '${target.typeName}'`);
        }

        const describeContents = target.methods.get(WorldObject.describeContents);

        if (!describeContents){
            throw new RuntimeError(`Unable to locate ${WorldObject.describeContents} on world object`);
        }

        describeContents.actualParameters[0] = Variable.forThis(target);

        return new RuntimeDelegate(describeContents);
    }

    private prepareRaiseContextualItemEvents(thread:Thread, type:EventType, actor:RuntimeAny, target:RuntimeAny){
        if (!(actor instanceof RuntimeWorldObject)){
            throw new RuntimeError(`Attempted to raise a contextual event on a non-world-object actor instance of type '${actor.typeName}'`);
        }

        if (!(target instanceof RuntimeWorldObject)){
            throw new RuntimeError(`Attempted to raise an event on a non-world-object instance of type '${target.typeName}'`);
        }
        
        return RaiseEvent.contextual(thread, type, actor, target);
    }

    private raiseEvent(thread:Thread, type:EventType, target:RuntimeAny){
        
        const eventDelegates = this.prepareRaiseEvent(thread, type, target);

        thread.currentMethod.push(Memory.allocateList(eventDelegates));
    }

    private prepareRaiseEvent(thread:Thread, type:EventType, target:RuntimeAny){
        if (!(target instanceof RuntimeWorldObject)){
            throw new RuntimeError(`Attempted to raise an event on a non-world-object instance of type '${target.typeName}'`);
        }

        return RaiseEvent.nonContextual(thread, type, target);
    }

    private inferTargetFrom(thread:Thread, targetName:string|undefined, understanding:Type, meaning:Meaning):RuntimeWorldObject|undefined{
        const lookupSingletonInstance = (name:string) => <RuntimeWorldObject>Memory.findInstanceByName(name);

        thread.writeInfo(`Inferring target '${targetName}' from meaning '${meaning}'`);
        
        switch(meaning){
            case Meaning.Moving:{
                const placeName = <RuntimeString>thread.currentPlace?.fields.get(`~${targetName}`)?.value;

                if (!placeName){
                    return undefined;
                }

                return lookupSingletonInstance(placeName.value); 
            }
            case Meaning.Inventory:{
                return lookupSingletonInstance(Player.typeName);
            }
            case Meaning.Describing:{
                if (!targetName){
                    return thread.currentPlace;
                }
    
                const [_, target] = Lookup.findTargetByNameIn(thread, thread.currentPlace!, targetName, false);
    
                return target;
            }
            case Meaning.Taking:{
                if (!targetName){
                    return undefined;
                }
    
                const [_, target] = Lookup.findTargetByNameIn(thread, thread.currentPlace!, targetName, false);
    
                return target;
            }
            case Meaning.Dropping:{
                const list = thread.currentPlayer!.getContentsField();
                const matchingItems = list.items.filter(x => x.typeName.toLowerCase() === targetName?.toLowerCase());
                
                if (matchingItems.length == 0){
                    return undefined;
                }

                return <RuntimeWorldObject>matchingItems[0];
            }
            case Meaning.Using:
            case Meaning.Combining:
            case Meaning.Opening:
            case Meaning.Closing:{
                if (!targetName){
                    thread.writeInfo("No target name was supplied, inferred no target");
                    return undefined;
                }
    
                const list = thread.currentPlayer!.getContentsField();
                const matchingInventoryItems = list.items.filter(x => x.typeName.toLowerCase() === targetName?.toLowerCase());
                
                if (matchingInventoryItems.length > 0){
                    thread.writeInfo("Found target in player's inventory");
                    return <RuntimeWorldObject>matchingInventoryItems[0];
                }
    
                const [_, target] = Lookup.findTargetByNameIn(thread, thread.currentPlace!, targetName, false);
    
                return target;
            }
            default:{
                return undefined;
            }
        }
    }
}