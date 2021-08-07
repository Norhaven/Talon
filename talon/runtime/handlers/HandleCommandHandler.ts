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
            return super.handle(thread);
        }

        switch(meaning){
            case Meaning.Describing:{
                this.describe(thread, actualTarget, false);
                break;
            }
            case Meaning.Moving: {    
                const nextPlace = <RuntimePlace>actualTarget;
                const currentPlace = thread.currentPlace;

                thread.currentPlace = nextPlace;
                
                this.describe(thread, actualTarget, false);
                this.raisePlaceEvent(thread, nextPlace, EventType.PlayerEntersPlace);
                this.raisePlaceEvent(thread, currentPlace!, EventType.PlayerExitsPlace);
                break;
            }
            case Meaning.Taking: {
                if (!(actualTarget instanceof RuntimeItem)){
                    this.output.write("I can't take that.");
                    thread.writeInfo(this.endOfInteraction);
                    return super.handle(thread);
                }

                const list = thread.currentPlace!.getContentsField();
                list.items = list.items.filter(x => x.typeName.toLowerCase() !== targetName?.toLowerCase());
                
                const inventory = thread.currentPlayer!.getContentsField();
                inventory.items.push(actualTarget);

                this.describe(thread, thread.currentPlace!, false);
                
                this.tryRaiseItemEvents(thread, thread.currentPlace!, EventType.ItIsTaken, actualTarget);
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

                this.describe(thread, thread.currentPlace!, false);
                
                this.tryRaiseItemEvents(thread, thread.currentPlace!, EventType.ItIsDropped, actualTarget);
                break;
            }
            case Meaning.Using:{
                if (actualActor){
                    this.tryRaiseContextualItemEvents(thread, thread.currentPlace!, EventType.ItIsUsed, actualActor, actualTarget);
                    this.tryRaiseItemEvents(thread, thread.currentPlace!, EventType.ItIsUsed, actualActor);
                } else {
                    this.tryRaiseItemEvents(thread, thread.currentPlace!, EventType.ItIsUsed, actualTarget);
                }

                break;
            }
            case Meaning.Opening:{
                this.tryRaiseItemEvents(thread, thread.currentPlace!, EventType.ItIsOpened, actualTarget);
                break;
            }
            case Meaning.Closing:{
                this.tryRaiseItemEvents(thread, thread.currentPlace!, EventType.ItIsClosed, actualTarget);
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

    private tryRaiseContextualItemEvents(thread:Thread, location:RuntimePlace, type:EventType, actor:RuntimeItem, target:RuntimeItem){
        const actorEvents = Array.from(actor.methods.values()!).filter(x => x.eventType == type && x.parameters.length > 0 && x.parameters[0].typeName === target.typeName);
        const targetEvents = Array.from(target.methods.values()!).filter(x => x.eventType == type && x.parameters.length > 0 && x.parameters[0].typeName === actor.typeName);

        const actorThis = Variable.forThis(new Type(actor.typeName, actor.parentTypeName), actor);
        const targetThis = Variable.forThis(new Type(target.typeName, target.parentTypeName), target);
        
        for(const event of actorEvents){
            event.actualParameters = [
                actorThis,
                new Variable(WorldObject.contextParameter, new Type(RuntimeItem.name, RuntimeAny.name), target)
            ];

            const delegate = new RuntimeDelegate(event);

            thread.currentMethod.push(delegate);
        }

        for(const event of targetEvents){
            event.actualParameters = [
                targetThis,
                new Variable(WorldObject.contextParameter, new Type(RuntimeItem.name, RuntimeAny.name), actor)
            ];

            const delegate = new RuntimeDelegate(event);

            thread.currentMethod.push(delegate);
        }
    }

    private tryRaiseItemEvents(thread:Thread, location:RuntimePlace, type:EventType, target:RuntimeItem){
        const events = Array.from(target.methods.values()!).filter(x => x.eventType == type && x.parameters.length === 0);

        for(const event of events){

            event.actualParameters = [
                Variable.forThis(new Type(target.typeName, target.parentTypeName), target)
            ];

            const delegate = new RuntimeDelegate(event);

            thread.currentMethod.push(delegate);           
        }
    }

    private raisePlaceEvent(thread:Thread, location:RuntimePlace, type:EventType){
        const events = Array.from(location.methods.values()!).filter(x => x.eventType == type);

        for(const event of events){
            const method = location.methods.get(event.name)!;
            method.actualParameters = [Variable.forThis(new Type(location?.typeName!, location?.parentTypeName!), location)];

            const delegate = new RuntimeDelegate(method);

            thread.currentMethod.push(delegate);
        }
    }

    private isItemVisible(item:RuntimeWorldObject){
        const visible = item.getFieldAsBoolean(WorldObject.visible);
        return visible.value;
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

        const directMatches = items.filter(x => x.typeName.toLowerCase() === targetName.toLowerCase() && this.isItemVisible(x));

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
    }

    private describe(thread:Thread, target:RuntimeWorldObject, isShallowDescription:boolean){
                
        if (!isShallowDescription){
            const contents = target.getFieldAsList(WorldObject.contents);

            //this.describeContents(thread, contents);
        }

        const describe = target.methods.get(WorldObject.describe)!;

        describe.actualParameters.unshift(Variable.forThis(new Type(target?.typeName!, target?.parentTypeName!), target));

        thread.currentMethod.push(new RuntimeDelegate(describe));
    }

    private observe(thread:Thread, target:RuntimeWorldObject){
        const observe = target.methods.get(WorldObject.observe)!;

        observe.actualParameters.unshift(Variable.forThis(new Type(target?.typeName!, target?.parentTypeName!), target));

        thread.currentMethod.push(new RuntimeDelegate(observe));        
    }

    private describeContents(thread:Thread, target:RuntimeList){
        for(const item of target.items){
            this.observe(thread, <RuntimeWorldObject>item);
        }
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
            default:
                return Meaning.Custom;
        }
    }
}