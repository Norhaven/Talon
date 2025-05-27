import { ComparisonType } from "../../../common/ComparisonType";
import { EventType } from "../../../common/EventType";
import { Punctuation } from "../../../compiler/lexing/Punctuation";
import { RuntimeError } from "../../errors/RuntimeError";
import { RuntimeAny } from "../../library/RuntimeAny";
import { RuntimeString } from "../../library/RuntimeString";
import { Thread } from "../../Thread";
import { OverloadContext } from "./OverloadContext";
import { ResolvableEvent } from "./ResolvableEvent";

export class OverloadResolver{

    private readonly contextTypeName:string;
    private readonly selectedIndex:number = -1;
    private readonly currentPlaceTypeName:string;

    get isEventTypeMatch(){
        return this.event.allowedEventTypes.some(x => x == this.context.eventType);
    }

    get isContextMatch(){
        if (!this.event.requiresContext || this.event.requiresComparison){
            return true;
        }

        const context = this.context.eventContext;
        
        if (!this.context && this.contextTypeName == ""){
            return true;
        }

        const contextType = context ? context.getType() : this.thread.knownTypes.get(this.contextTypeName);

        if (contextType){
            return this.event.allowedContextTypeNames.some(x => contextType.isTypeOf(x));
        }
        
        return this.event.allowedContextTypeNames.length == 0;
    }

    get isDirectionalMatch(){
        if (!this.context.eventDirection || this.context.eventDirection.value == ""){
            return false;
        }

        return this.event.allowedContextTypeNames.some(x => x == this.context.eventDirection?.value)
    }

    get isSelectedIndexMatch(){
        if (!this.event.requiresIndex){
            return true;
        }

        return this.event.index == this.selectedIndex;
    }

    get isComparisonMatch(){
        if (!this.event.requiresComparison){
            return true;
        }

        return this.compareWith(this.context.eventContext);
    }

    get isLocationMatch(){
        if (!this.event.requiresLocations){
            return true;
        }

        return this.event.locations.some(x => x == this.currentPlaceTypeName);
    }

    get isInvokable(){
        if (!this.isEventTypeMatch){
            this.thread.logReadable(`${this.event.name} is not valid for event type '${this.context.eventType}'`);
            return false;
        }

        if (!this.isContextMatch && !this.isDirectionalMatch){
            this.thread.logReadable(`${this.event.name} is not valid for event context and direction`);
            return false;
        } 
        
        if (!this.isComparisonMatch){
            this.thread.logReadable(`${this.event.name} is not valid for event comparison`);
            return false;
        }

        if (!this.isSelectedIndexMatch){
            this.thread.logReadable(`${this.event.name} is not valid for event index`);
            return false;
        }

        if (!this.isLocationMatch){
            this.thread.logReadable(`${this.event.name} is not valid for event location`);
            return false;
        }

        this.thread.logReadable(`${this.event.name} is valid!`);

        return true;
    }

    constructor(private readonly thread:Thread, private readonly event:ResolvableEvent, private readonly context:OverloadContext){
        const eventContext = this.context.eventContext;

        this.currentPlaceTypeName = this.thread.currentPlace?.typeName || "";
        this.contextTypeName = (eventContext instanceof RuntimeString) ? eventContext.value : eventContext?.typeName || "";

        // Dynamic menu options will have a number appended to their type name indicating which
        // index the option belongs to, so if that shows up here we need to pull that out for comparison.

        if (this.contextTypeName && this.contextTypeName.includes(Punctuation.colon)){
            this.selectedIndex = Number(this.contextTypeName.split(Punctuation.colon)[1]);
        }
    }

    private compareWith(context?:RuntimeAny){
        if (!context){
            return false;
        }
        
        const comparison = this.event.comparisonKind;

        for(const type of this.event.allowedContextTypeNames){
            const comparisonValue = Number(type);

            if (context.isInteger()){
                if (comparison == ComparisonType.EqualTo){
                    return comparisonValue == context.value;
                } else if (comparison == ComparisonType.LessThan){
                    return context.value < comparisonValue;
                } else if (comparison == ComparisonType.GreaterThan){
                    return context.value > comparisonValue;
                }
            } else if (this.event.actor.isString() && context.isString()){
                if (this.event.comparisonKind != ComparisonType.EqualTo){
                    throw new RuntimeError(`Unable to compare string '${context.value}' without a direct equality comparison`);
                }
                
                return this.event.actor.value == context.value;
            } 
        }
        
        return false;
    }
}