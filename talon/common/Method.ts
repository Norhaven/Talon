import { Parameter } from "./Parameter";
import { Instruction } from "./Instruction";
import { Variable } from "../runtime/library/Variable";
import { EventType } from "./EventType";
import { ComparisonType } from "./ComparisonType";

export class Method{
    name:string = "";
    parameters:Parameter[] = [];
    actualParameters:Variable[] = [];
    body:Instruction[] = [];
    returnType:string = "";
    eventType:EventType[] = [EventType.None];
    closureParameters:string[] = [];
    locationConditions:string[] = [];
    comparisonType:ComparisonType = ComparisonType.None;
    actorType:string = "";
    targetTypes:string[] = [];
    callIndex:number = -1;

    get hasIndex(){
        return this.callIndex != null;    
    }

    get hasComparison(){
        return this.comparisonType != null && this.comparisonType != ComparisonType.None;
    }

    get hasLocations(){
        return this.locationConditions.length > 0;
    }

    get signature(){
        if (this.name == "~event"){
            return `${this.name}_${this.actorType}_${this.eventType.sort().join('|')}_${this.targetTypes.sort().join('|')}#${this.callIndex}:${this.comparisonType}@${this.locationConditions.sort().join('|')}`;
        }

        return this.name;
    }

    isEqualTo(method:Method){
        return this.signature == method.signature;
    }
}