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
import { State } from "../../common/State";
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
import { Stopwatch } from "../../Stopwatch";
import { RuntimeTuple } from "../library/RuntimeTuple";
import { Action } from "./internal/Action";

export class HandleCommandHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.HandleCommand;

    private readonly endOfInteraction = "=========END OF INTERACTION=========";

    constructor(private readonly output:IOutput){
        super();
    }

    tryGetUnderstandingFromAction(thread:Thread, action:string){
        const findValueForActionField = (type:Type) => <string[]>type.fields.find(field => field.name === Understanding.action)?.defaultValue!;
        const getActionUnderstandingPair = (type:Type):readonly [string[], Type] => [findValueForActionField(type), type];
        
        const understandingActionPairs = thread.knownUnderstandings.map(getActionUnderstandingPair);
        
        const match = understandingActionPairs.find(x => x[0].some(y => y == action));
        
        return match ? match[1] : null;
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
            case Understanding.giving: return Meaning.Giving;
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
        
        return Stopwatch.measure("HandleCommand", () => {
            const command = thread.currentMethod.pop();

            if (!(command instanceof RuntimeCommand)){
                throw new RuntimeError(`Unable to handle a non-command, found '${command}'`);
            }

            const action = command.action!.value;
            const actorName = command.actorName?.value;
            const targetName = command.targetName?.value;

            this.logInteraction(thread, `'${action} ${actorName} ${targetName}'`);

            const understanding = this.tryGetUnderstandingFromAction(thread, action);

            if (!understanding){
                thread.currentMethod.push(Memory.allocateList([]));
                thread.logReadable(`Unable to locate understanding for action '${action}'`);
                thread.logReadable(this.endOfInteraction);
                return super.handle(thread);
            }

            const meaning = this.getMeaningFromUnderstanding(understanding);

            if (meaning === Meaning.Pressing){
                return this.handleKeyPress(thread, understanding);
            } else {
                const actualTarget = this.inferTargetFrom(thread, targetName, understanding, meaning);
                
                if (!actualTarget){                
                    this.output.write("I don't know what you're referring to.");
                    thread.logReadable(this.endOfInteraction);
                    thread.currentMethod.push(Memory.allocateList([]));

                    return super.handle(thread);
                }

                const actualActor = this.inferActorFrom(thread, actorName, meaning);

                return this.handleCommand(thread, meaning, actualActor, actualTarget);
            }
        });
    }

    private handleKeyPress(thread:Thread, understanding:Type){
        const key = <string[]>understanding.fields.find(x => x.name === Understanding.action)?.defaultValue;
        const keyString = Memory.allocateString(key[0]);
        keyString.typeName = key[0];

        const globalWhen = Memory.findOrAddInstance(GlobalEvents.typeName);

        const placeEvent = RaiseEvent.contextual(thread, EventType.KeyIsPressed, thread.currentPlace!, keyString);        
        const globalEvent = RaiseEvent.contextual(thread, EventType.KeyIsPressed, globalWhen, keyString);

        thread.currentMethod.push(Memory.allocateList([...placeEvent, ...globalEvent]));
        
        return super.handle(thread);
    }

    private handleCommand(thread:Thread, meaning:Meaning, actor:RuntimeWorldObject|undefined, target:RuntimeWorldObject){
        
        const action = Action.using(thread, actor, target, this.output);

        switch(meaning){
            case Meaning.Describing:{
                action.tryDescribeTarget();
                break;
            }
            case Meaning.Moving: {    
                action.tryMoveToTarget();
                break;
            }
            case Meaning.Taking: {
                action.tryTakeTarget();
                break;
            }
            case Meaning.Giving: {
                action.tryGiveToTarget();
                break;
            }
            case Meaning.Inventory:{
                action.tryDescribeTargetContents();       
                break;
            }
            case Meaning.Dropping:{
                action.tryDropItemTarget();
                break;
            }
            case Meaning.Using:{
                action.tryUseTarget();
                break;
            }
            case Meaning.Opening:{
                action.tryOpenTarget();
                break;
            }
            case Meaning.Closing:{
                action.tryCloseTarget();
                break;
            }
            case Meaning.Combining:{                
                action.tryCombineTarget();
                break;
            }            
            default:
                throw new RuntimeError("Unsupported meaning found");
        }  

        thread.logReadable(this.endOfInteraction);

        return super.handle(thread);
    }

    private inferActorFrom(thread:Thread, actorName:string|undefined, meaning:Meaning):RuntimeWorldObject|undefined{
        const lookupSingletonInstance = (name:string) => <RuntimeWorldObject>Memory.findInstanceByName(name);

        thread.logReadable(`Inferring actor '${actorName}' from meaning '${meaning}'`);
        
        switch(meaning){
            case Meaning.Moving:
            case Meaning.Inventory:
            case Meaning.Dropping:
                return lookupSingletonInstance(Player.typeName);
            case Meaning.Describing:
            case Meaning.Taking:{
                if (!actorName){
                    return thread.currentPlace;
                }
    
                const [_, actor] = Lookup.findTargetByNameIn(thread, thread.currentPlace!, actorName, false);
    
                return actor;
            }
            case Meaning.Giving:{
                if (!actorName){
                    thread.logReadable("No actor name was supplied, inferred nothing");
                    return undefined;
                }

                const [_, actor] = Lookup.findTargetByNameIn(thread, thread.currentPlayer!, actorName, false);

                return actor;
            }
            case Meaning.Using:
            case Meaning.Combining:
            case Meaning.Opening:
            case Meaning.Closing:{
                if (!actorName){
                    thread.logReadable("No actor name was supplied, inferred no target");
                    return undefined;
                }
    
                const list = thread.currentPlayer!.getContentsField();
                const matchingInventoryItems = list.items.filter(x => x.typeName.toLowerCase() === actorName.toLowerCase());
                
                if (matchingInventoryItems.length > 0){
                    thread.logReadable("Found actor in player's inventory");
                    return <RuntimeWorldObject>matchingInventoryItems[0];
                }
    
                const [_, actor] = Lookup.findTargetByNameIn(thread, thread.currentPlace!, actorName, false);
    
                return actor;
            }
            default:
                return undefined;
        }
    }

    private inferTargetFrom(thread:Thread, targetName:string|undefined, understanding:Type, meaning:Meaning):RuntimeWorldObject|undefined{
        const lookupSingletonInstance = (name:string) => <RuntimeWorldObject>Memory.findInstanceByName(name);

        thread.logReadable(`Inferring target '${targetName}' from meaning '${meaning}'`);
        
        switch(meaning){
            case Meaning.Moving:{
                const knownDirections = thread.currentPlace?.getFieldAsList(WorldObject.directions);
                const matchingDirection = <RuntimeTuple<string>>knownDirections?.items.find(x => (<RuntimeTuple<string>>x).value1 == targetName);
                const placeName = matchingDirection?.value2;

                if (!placeName){
                    return undefined;
                }

                return lookupSingletonInstance(placeName); 
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
            case Meaning.Taking:
            case Meaning.Giving:{
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
                    thread.logReadable("No target name was supplied, inferred no target");
                    return undefined;
                }
    
                const list = thread.currentPlayer!.getContentsField();
                const matchingInventoryItems = list.items.filter(x => x.typeName.toLowerCase() === targetName.toLowerCase());
                
                if (matchingInventoryItems.length > 0){
                    thread.logReadable("Found target in player's inventory");
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