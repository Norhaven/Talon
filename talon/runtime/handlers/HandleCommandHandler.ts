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

export class HandleCommandHandler extends OpCodeHandler{
    constructor(private readonly output:IOutput){
        super();
    }

    handle(thread:Thread){
        
        const command = thread.currentMethod.pop();

        if (!(command instanceof RuntimeCommand)){
            throw new RuntimeError(`Unable to handle a non-command, found '${command}`);
        }

        const action = command.action!.value;
        const targetName = command.targetName!.value;

        thread.log?.debug(`.handle.cmd '${action} ${targetName}'`);

        const understandingsByAction = new Map<Object, Type>(thread.knownUnderstandings.map(x => [x.fields.find(field => field.name == Understanding.action)?.defaultValue!, x]));

        const understanding = understandingsByAction.get(action);

        if (!understanding){
            this.output.write("I don't know how to do that.");
            return super.handle(thread);
        }

        const meaningField = understanding.fields.find(x => x.name == Understanding.meaning);

        const meaning = this.determineMeaningFor(<string>meaningField?.defaultValue!);
        const actualTargetName = this.inferTargetFrom(thread, targetName, meaning);
        
        if (!actualTargetName){
            this.output.write("I don't know what you're referring to.");
            return super.handle(thread);
        }

        const target = thread.knownTypes.get(actualTargetName);

        if (!target){
            throw new RuntimeError("Unable to locate type");
        }

        const instance = this.locateTargetInstance(thread, target, meaning);

        if (!(instance instanceof RuntimeWorldObject)){
            throw new RuntimeError("Unable to locate world type");
        }

        switch(meaning){
            case Meaning.Describing:{
                this.describe(thread, instance, false);
                break;
            }
            case Meaning.Moving: {    
                const nextPlace = <RuntimePlace>instance;
                const currentPlace = thread.currentPlace;

                thread.currentPlace = nextPlace;
                
                this.describe(thread, instance, false);
                this.raiseEvent(thread, nextPlace, EventType.PlayerEntersPlace);
                this.raiseEvent(thread, currentPlace!, EventType.PlayerExitsPlace);
                break;
            }
            case Meaning.Taking: {
                if (!(instance instanceof RuntimeItem)){
                    this.output.write("I can't take that.");
                    return super.handle(thread);
                }

                const list = thread.currentPlace!.getContentsField();
                list.items = list.items.filter(x => x.typeName != target.name);
                
                const inventory = thread.currentPlayer!.getContentsField();
                inventory.items.push(instance);

                this.describe(thread, thread.currentPlace!, false);
                break;
            }
            case Meaning.Inventory:{
                const inventory = (<RuntimePlayer>instance).getContentsField();
                this.describeContents(thread, inventory);
                break;
            }
            case Meaning.Dropping:{
                const list = thread.currentPlayer!.getContentsField();
                list.items = list.items.filter(x => x.typeName != target.name);
                
                const contents = thread.currentPlace!.getContentsField();
                contents.items.push(instance);

                this.describe(thread, thread.currentPlace!, false);
                break;
            }
            default:
                throw new RuntimeError("Unsupported meaning found");
        }  

        return super.handle(thread);
    }

    private raiseEvent(thread:Thread, location:RuntimePlace, type:EventType){
        const events = Array.from(location.methods.values()!).filter(x => x.eventType == type);

        for(const event of events){
            const method = location.methods.get(event.name)!;
            method.actualParameters = [new Variable("~this", new Type(location?.typeName!, location?.parentTypeName!), location)];

            const delegate = new RuntimeDelegate(method);

            thread.currentMethod.push(delegate);
        }
    }

    private locateTargetInstance(thread:Thread, target:Type, meaning:Meaning):RuntimeAny|undefined{
        if (meaning === Meaning.Taking){
            const list = <RuntimeList>thread.currentPlace!.fields.get(WorldObject.contents)?.value;
            const matchingItems = list.items.filter(x => x.typeName === target.name);
            
            if (matchingItems.length == 0){
                return undefined;
            }

            return matchingItems[0];
        } else if (meaning === Meaning.Dropping){
            const list = <RuntimeList>thread.currentPlayer!.fields.get(WorldObject.contents)?.value;            
            const matchingItems = list.items.filter(x => x.typeName === target.name);
            
            if (matchingItems.length == 0){
                return undefined;
            }

            return matchingItems[0];
        } else {        
            return Memory.findInstanceByName(target.name);
        }
    }

    private inferTargetFrom(thread:Thread, targetName:string, meaning:Meaning){
        if (meaning === Meaning.Moving){
            const placeName = <RuntimeString>thread.currentPlace?.fields.get(`~${targetName}`)?.value;

            if (!placeName){
                return undefined;
            }

            return placeName.value;
        }

        if (meaning === Meaning.Inventory){
            return Player.typeName;
        }

        return targetName;
    }

    private describe(thread:Thread, target:RuntimeWorldObject, isShallowDescription:boolean){
        
        thread.currentMethod.push(target);

        const describe = target.methods.get(WorldObject.describe)!;

        describe.actualParameters.unshift(new Variable("~this", new Type(target?.typeName!, target?.parentTypeName!), target));

        thread.currentMethod.push(new RuntimeDelegate(describe));
    }

    private describeContents(executionPoint:Thread, target:RuntimeList){
        for(const item of target.items){
            this.describe(executionPoint, <RuntimeWorldObject>item, true);
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
            default:
                return Meaning.Custom;
        }
    }
}