import { ComparisonType } from "../../../common/ComparisonType";
import { EventType } from "../../../common/EventType";
import { Method } from "../../../common/Method";
import { Type } from "../../../common/Type";
import { Punctuation } from "../../../compiler/lexing/Punctuation";
import { NumberType } from "../../../library/NumberType";
import { WorldObject } from "../../../library/WorldObject";
import { Memory } from "../../common/Memory";
import { RuntimeError } from "../../errors/RuntimeError";
import { RuntimeAny } from "../../library/RuntimeAny";
import { RuntimeString } from "../../library/RuntimeString";
import { Variable } from "../../library/Variable";
import { Thread } from "../../Thread";
import { OverloadContext } from "./OverloadContext";
import { OverloadResolver } from "./OverloadResolver";

export class ResolvableEvent{
    private readonly types:EventType[] = [];
    private readonly hasParameters:boolean;
    private readonly contextTypes:string[] = [];

    get name(){
        return this.method.name;
    }

    get requiresIndex(){
        return this.method.hasIndex;
    }

    get index(){
        return this.method.callIndex;
    }

    get requiresComparison(){
        return this.method.hasComparison;
    }

    get comparisonKind(){
        return this.method.comparisonType;
    }

    get requiresLocations(){
        return this.method.hasLocations;
    }

    get locations(){
        return this.method.locationConditions;
    }

    get allowedEventTypes(){
        return this.types;
    }

    get allowedContextTypeNames(){
        return this.contextTypes;
    }

    get requiresContext(){
        return this.contextTypes.length > 0;
    }

    constructor(private readonly thread:Thread, public readonly actor:RuntimeAny, private readonly method:Method){           
        this.types = method.eventType;
        this.hasParameters = method.parameters.length > 0;
        this.contextTypes = this.hasParameters ? this.method.targetTypes : [];
    }

    canBeInvokedWith(eventType:EventType, context?:RuntimeAny, direction?:RuntimeString){
        const overloadContext = new OverloadContext(eventType, context, direction);
        const resolver = new OverloadResolver(this.thread,  this, overloadContext);

        return resolver.isInvokable;
    }

    toDelegate(context?:RuntimeAny, direction?:RuntimeString){
        const actorThis = Variable.forThis(this.actor);
        const actualParameters = [actorThis];

        if (context){
            actualParameters.push(new Variable(WorldObject.contextParameter, new Type(context.typeName, context.parentTypeName), context))
        }

        if (direction){
            actualParameters.push(new Variable(WorldObject.directionParameter, new Type(direction.typeName, direction.parentTypeName), direction));
        }

        this.method.actualParameters = actualParameters;

        return Memory.allocateDelegate(this.method);
    }
}