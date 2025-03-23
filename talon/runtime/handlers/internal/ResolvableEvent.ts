import { EventType } from "../../../common/EventType";
import { Method } from "../../../common/Method";
import { Type } from "../../../common/Type";
import { WorldObject } from "../../../library/WorldObject";
import { Memory } from "../../common/Memory";
import { RuntimeAny } from "../../library/RuntimeAny";
import { RuntimeString } from "../../library/RuntimeString";
import { Variable } from "../../library/Variable";

export class ResolvableEvent{
    private static readonly typeDelimiter = "|";

    private readonly types:EventType[] = [];
    private readonly hasParameters:boolean;
    private readonly contextTypes:string[] = [];

    get name(){
        return this.method.name;
    }

    get actorType(){
        return this.actor.getType();
    }

    get allowedEventTypes(){
        return this.types;
    }

    get allowedContextTypeNames(){
        return this.contextTypes;
    }

    constructor(private readonly actor:RuntimeAny, private readonly method:Method){        
        const parts = method.name.split('_');

        this.types = method.eventType;
        this.hasParameters = method.parameters.length > 0;
        this.contextTypes = this.hasParameters ? parts[parts.length - 1].split(ResolvableEvent.typeDelimiter).map(x => x) : [];
    }

    canBeInvokedWith(eventType:EventType, context?:RuntimeAny){
        const contextTypeName = (context instanceof RuntimeString) ? context.value : context?.typeName;
        const isEventTypeMatch = this.types.some(x => x == eventType);
        const isContextMatch = this.hasParameters ? this.contextTypes.some(x => x == contextTypeName) : true;
        
        return isEventTypeMatch && isContextMatch;
    }

    toDelegate(context?:RuntimeAny){
        const actorThis = Variable.forThis(this.actor);
        const actualParameters = [actorThis];

        if (context){
            actualParameters.push(new Variable(WorldObject.contextParameter, new Type(context.typeName, context.parentTypeName), context))
        }

        this.method.actualParameters = actualParameters;

        return Memory.allocateDelegate(this.method);
    }
}