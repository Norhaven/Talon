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

export class HandleCommandHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.HandleCommand;

    private readonly endOfInteraction = "=========END OF INTERACTION=========";

    constructor(private readonly output:IOutput){
        super();
    }

    handle(thread:Thread){
        
        const command = thread.currentMethod.pop();

        if (!(command instanceof RuntimeCommand)){
            throw new RuntimeError(`Unable to handle a non-command, found '${command}`);
        }

        const action = command.action!.value;
        const actor = command.actorName?.value;
        const targetName = command.targetName?.value;

        this.logInteraction(thread, `'${action} ${actor} ${targetName}'`);

        const understandingsByAction = new Map<Object, Type>(thread.knownUnderstandings.map(x => [x.fields.find(field => field.name == Understanding.action)?.defaultValue!, x]));

        const understanding = understandingsByAction.get(action);

        if (!understanding){
            this.output.write("I don't know how to do that.");
            thread.writeInfo(this.endOfInteraction);
            return super.handle(thread);
        }

        const meaningField = understanding.fields.find(x => x.name == Understanding.meaning);

        const meaning = this.determineMeaningFor(<string>meaningField?.defaultValue!);
        const actualActor = this.inferTargetFrom(thread, actor, meaning);
        const actualTarget = this.inferTargetFrom(thread, targetName, meaning);
        
        if (!actualTarget){
            this.output.write("I don't know what you're referring to.");
            thread.writeInfo(this.endOfInteraction);
            thread.currentMethod.push(new RuntimeEmpty());

            return super.handle(thread);
        }

        switch(meaning){
            case Meaning.Describing:{
                const delegate = this.describe(thread, actualTarget);

                thread.currentMethod.push(delegate);

                return EvaluationResult.Continue;
            }
            case Meaning.Moving: {    
                const nextPlace = <RuntimePlace>actualTarget;
                const currentPlace = thread.currentPlace;

                thread.currentPlace = nextPlace;
                
                const delegate = this.describe(thread, actualTarget);
                const delegates = this.prepareRaiseEvent(thread, EventType.PlayerEntersPlace, nextPlace);
                const delegates1 = this.prepareRaiseEvent(thread, EventType.PlayerExitsPlace, currentPlace!);
                     
                const allDelegates = [
                    ...delegates1,
                    ...delegates,
                    delegate
                ];

                thread.writeInfo(`Moving with ${allDelegates.length} events to be raised`);

                thread.currentMethod.push(Memory.allocateList(allDelegates));
                break;
            }
            case Meaning.Taking: {
                if (!actualTarget.isTypeOf(Item.typeName)){
                    this.output.write("I can't take that.");
                    thread.writeInfo(`Unable to take '${actualTarget.typeName}:${actualTarget.parentTypeName}', not an item`);
                    thread.writeInfo(this.endOfInteraction);
                    return super.handle(thread);
                }

                const list = thread.currentPlace!.getContentsField();
                list.items = list.items.filter(x => x.typeName.toLowerCase() !== targetName?.toLowerCase());
                
                const inventory = thread.currentPlayer!.getContentsField();
                inventory.items.push(actualTarget);

                const describeEvent = this.describe(thread, thread.currentPlace!);                
                const takeEvent = this.prepareRaiseEvent(thread, EventType.ItIsTaken, actualTarget);                

                thread.currentMethod.push(Memory.allocateList([...takeEvent, describeEvent]))

                break;
            }
            case Meaning.Inventory:{
                const inventory = (<RuntimePlayer>actualTarget).getContentsField();
                this.nameAndTotalContents(thread, inventory);
                
                break;
            }
            case Meaning.Dropping:{
                const list = thread.currentPlayer!.getContentsField();
                list.items = list.items.filter(x => x.typeName.toLowerCase() !== targetName?.toLowerCase());
                
                const contents = thread.currentPlace!.getContentsField();
                contents.items.push(actualTarget);

                const describeEvent = this.describe(thread, thread.currentPlace!);                
                const event = this.prepareRaiseEvent(thread, EventType.ItIsDropped, actualTarget);

                thread.currentMethod.push(Memory.allocateList([...event, describeEvent]));

                break;
            }
            case Meaning.Using:{
                if (actualActor){
                    const contextual = this.prepareRaiseContextualItemEvents(thread, EventType.ItIsUsed, actualActor, actualTarget);
                    const event = this.prepareRaiseEvent(thread, EventType.ItIsUsed, actualActor);

                    thread.currentMethod.push(Memory.allocateList([...event, ...contextual]));
                } else {
                    this.raiseEvent(thread, EventType.ItIsUsed, actualTarget);
                }

                break;
            }
            case Meaning.Opening:{
                this.raiseEvent(thread, EventType.ItIsOpened, actualTarget);
                break;
            }
            case Meaning.Closing:{
                this.raiseEvent(thread, EventType.ItIsClosed, actualTarget);
                break;
            }
            case Meaning.Combining:{
                
                if (actualActor){
                    const contextual = this.prepareRaiseContextualItemEvents(thread, EventType.ItIsCombined, actualActor, actualTarget);
                    const event1 = this.prepareRaiseEvent(thread, EventType.ItIsCombined, actualActor);
                    const event2 = this.prepareRaiseEvent(thread, EventType.ItIsCombined, actualTarget); 

                    thread.currentMethod.push(Memory.allocateList([...event1, ...event2, ...contextual]));
                } else {
                    this.raiseEvent(thread, EventType.ItIsCombined, actualTarget);
                }

                break;
            }
            default:
                throw new RuntimeError("Unsupported meaning found");
        }  

        thread.writeInfo(this.endOfInteraction);

        return super.handle(thread);
    }

    private isState(thread:Thread, target:RuntimeWorldObject, state:string){
        const stateField = target.fields.get(WorldObject.state);
        const stateList = <RuntimeList>stateField?.value;

        return stateList.items.some(x => (<RuntimeString>x).value === state);
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

    private isItemVisible(item:RuntimeWorldObject){
        const visible = item.getFieldAsBoolean(WorldObject.visible);
        return visible.value;
    }

    private objectNameMatches(worldObject:RuntimeWorldObject, name:string){
        if (worldObject.typeName.toLowerCase() === name.toLowerCase()){
            return true;
        }

        const aliases = <RuntimeList>worldObject.fields.get(WorldObject.aliases)?.value;

        for(const alias of aliases.items){
            if (alias instanceof RuntimeString){
                if (alias.value.toLowerCase() === name.toLowerCase()){
                    return true;
                }
            } else {
                throw new RuntimeError(`Found type '${alias.typeName}' instead of string during alias match attempt`);
            }
        }

        return false;
    }

    private findTargetNameIn(thread:Thread, sourceItem:RuntimeWorldObject, targetName:string, removeWhenFound:boolean):RuntimeWorldObject|undefined{
        thread.writeInfo(`Looking for target '${targetName}' in '${sourceItem}'`);

        const isAvailable = (item:RuntimeWorldObject) => this.isItemVisible(item) && !this.isState(thread, item, States.closed);
        const isClosed = this.isState(thread, sourceItem, States.closed);
        const isOpened = this.isState(thread, sourceItem, States.opened);

        if (!this.isItemVisible(sourceItem) || isClosed){
            thread.writeInfo(`Target container not applicable, is invisible or closed`);
            return undefined;
        }

        const contents = sourceItem.getContentsField();
        const items = contents.items.map(x => (<RuntimeWorldObject>x));

        const directMatches = items.filter(x => this.objectNameMatches(x, targetName) && this.isItemVisible(x));

        if (directMatches.length > 0){
            thread.writeInfo(`One or more direct matches were found, target matched`);

            const matchedItem = directMatches[0];

            if (removeWhenFound){
                contents.items = items.filter(x => x !== matchedItem);
            }

            return directMatches[0];
        }

        thread.writeInfo(`No direct matches were found, continuing search in contents`);

        for(const item of items){
            if (!isAvailable(item)){
                thread.writeInfo(`Item '${item.typeName}' is unavailable, skipping`)
                continue;
            }

            const locatedItem = this.findTargetNameIn(thread, item, targetName, removeWhenFound);

            if (locatedItem){
                return locatedItem;
            }
        }

        return undefined;
    }

    private inferTargetFrom(thread:Thread, targetName:string|undefined, meaning:Meaning):RuntimeWorldObject|undefined{
        const lookupInstance = (name:string) => {
            try{     
                return <RuntimeWorldObject>Memory.findInstanceByName(name);
            } catch(ex){
                return undefined;
            }
        };

        thread.writeInfo(`Inferring target '${targetName}' from meaning '${meaning}'`);
        
        if (meaning === Meaning.Moving){
            const placeName = <RuntimeString>thread.currentPlace?.fields.get(`~${targetName}`)?.value;

            if (!placeName){
                return undefined;
            }

            return lookupInstance(placeName.value);            
        } else if (meaning === Meaning.Inventory){
            return lookupInstance(Player.typeName);
        } else if (meaning === Meaning.Describing){
            if (!targetName){
                return thread.currentPlace;
            }

            return this.findTargetNameIn(thread, thread.currentPlace!, targetName, false);          
        } else if (meaning === Meaning.Taking){
            if (!targetName){
                return undefined;
            }

            return this.findTargetNameIn(thread, thread.currentPlace!, targetName, true);
        } else if (meaning === Meaning.Dropping){
            const list = thread.currentPlayer!.getContentsField();
            const matchingItems = list.items.filter(x => x.typeName.toLowerCase() === targetName?.toLowerCase());
            
            if (matchingItems.length == 0){
                return undefined;
            }

            return <RuntimeWorldObject>matchingItems[0];
        } else if (meaning === Meaning.Using ||
                   meaning === Meaning.Combining ||
                   meaning === Meaning.Opening ||
                   meaning === Meaning.Closing){
            
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

            return this.findTargetNameIn(thread, thread.currentPlace!, targetName, false);
        } else {
            return undefined;
        }
    }

    private nameAndTotalContents(thread:Thread, contents:RuntimeList){
        const names = contents.items.map(x => x.typeName);

        const namesWithCount = new Map<string, number>();

        for(const name of names){
            if (!namesWithCount.has(name)){
                namesWithCount.set(name, 1);
            } else {
                const count = namesWithCount.get(name)!;
                namesWithCount.set(name, count + 1);
            }
        }

        const namedValues:string[] = [];

        for(const [name, value] of namesWithCount){
            namedValues.push(`${value} ${name}(s)`);
        }

        namedValues.forEach(x => this.output.write(x));
        this.output.write("");
    }

    private raiseDescribeEvent(thread:Thread, target:RuntimeWorldObject){
        const delegate = this.describe(thread, target);

        thread.currentMethod.push(Memory.allocateList([delegate]));
    }

    private describe(thread:Thread, target:RuntimeWorldObject){
                
        const describe = target.methods.get(WorldObject.describe)!;

        describe.actualParameters.unshift(Variable.forThis(target));

        return new RuntimeDelegate(describe);
    }

    private determineMeaningFor(action:string):Meaning{
        const systemAction = `~${action}`;

        // TODO: Support custom actions better.

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
            default:
                return Meaning.Custom;
        }
    }
}