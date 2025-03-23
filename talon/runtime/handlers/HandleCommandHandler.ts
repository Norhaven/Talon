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
import { Event } from "./internal/Event";
import { Lookup } from "./internal/Lookup";
import { GlobalEvents } from "../../library/GlobalEvents";
import { Stopwatch } from "../../Stopwatch";
import { RuntimeTuple } from "../library/RuntimeTuple";
import { Action } from "./internal/Action";
import { Infer } from "./internal/Infer";
import { ActionContext } from "./internal/ActionContext";

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
            const actorName = command.actorName.value;
            const targetName = command.targetName?.value;

            this.logInteraction(thread, `'${action} ${actorName} ${targetName}'`);

            const understanding = this.tryGetUnderstandingFromAction(thread, action);

            if (!understanding){
                this.output.write(`Sorry, I don't know how to ${action}.`);
                thread.currentMethod.push(Memory.allocateList([]));
                thread.logReadable(`Unable to locate understanding for action '${action}'`);
                thread.logReadable(this.endOfInteraction);
                return super.handle(thread);
            }

            const meaning = this.getMeaningFromUnderstanding(understanding);

            if (meaning === Meaning.Pressing){
                return this.handleKeyPress(thread, understanding);
            } else {
                const context = Infer.contextFrom(thread, meaning, actorName, targetName);

                if (context.isEmpty){             
                    this.output.write("I don't know what you're referring to.");
                    thread.logReadable(this.endOfInteraction);
                    thread.currentMethod.push(Memory.allocateList([]));

                    return super.handle(thread);
                }

                return this.handleCommand(thread, meaning, context);
            }
        });
    }

    private handleKeyPress(thread:Thread, understanding:Type){
        const key = <string[]>understanding.fields.find(x => x.name === Understanding.action)?.defaultValue;
        const keyString = Memory.allocateString(key[0]);
        keyString.typeName = key[0];

        const globalWhen = Memory.findOrAddInstance(GlobalEvents.typeName);

        // TODO: Make RaiseEvent methods use the EventResolver and put things on the stack so we don't have to do that here.

        const placeEvent = Event.using(thread).prepareContextual(EventType.KeyIsPressed, thread.currentPlace!, keyString);        
        const globalEvent = Event.using(thread).prepareContextual(EventType.KeyIsPressed, globalWhen, keyString);

        Event.using(thread).raiseAll(...placeEvent, ...globalEvent);
        
        return super.handle(thread);
    }

    private handleCommand(thread:Thread, meaning:Meaning, context:ActionContext){
        
        const action = Action.using(thread, context, this.output);

        switch(meaning){
            case Meaning.Describing:{
                action.tryDescribe();
                break;
            }
            case Meaning.Moving: {    
                action.tryMove();
                break;
            }
            case Meaning.Taking: {
                action.tryTake();
                break;
            }
            case Meaning.Giving: {
                action.tryGive();
                break;
            }
            case Meaning.Inventory:{
                action.tryDescribeContents();       
                break;
            }
            case Meaning.Dropping:{
                action.tryDropItem();
                break;
            }
            case Meaning.Using:{
                action.tryUse();
                break;
            }
            case Meaning.Opening:{
                action.tryOpen();
                break;
            }
            case Meaning.Closing:{
                action.tryClose();
                break;
            }
            case Meaning.Combining:{                
                action.tryCombine();
                break;
            }            
            default:
                throw new RuntimeError("Unsupported meaning found");
        }  

        thread.logReadable(this.endOfInteraction);

        return super.handle(thread);
    }
}