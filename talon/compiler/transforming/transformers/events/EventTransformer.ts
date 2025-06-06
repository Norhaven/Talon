import { ComparisonType } from "../../../../common/ComparisonType";
import { EventType } from "../../../../common/EventType";
import { Instruction } from "../../../../common/Instruction";
import { Method } from "../../../../common/Method";
import { Parameter } from "../../../../common/Parameter";
import { State } from "../../../../common/State";
import { Type } from "../../../../common/Type";
import { BooleanType } from "../../../../library/BooleanType";
import { WorldObject } from "../../../../library/WorldObject";
import { CompilationError } from "../../../exceptions/CompilationError";
import { Keywords } from "../../../lexing/Keywords";
import { ActionsExpression } from "../../../parsing/expressions/ActionsExpression";
import { TypeDeclarationExpression } from "../../../parsing/expressions/TypeDeclarationExpression";
import { WhenDeclarationExpression } from "../../../parsing/expressions/WhenDeclarationExpression";
import { ExpressionTransformationMode } from "../../ExpressionTransformationMode";
import { TransformerContext } from "../../TransformerContext";
import { ExpressionTransformer } from "../expressions/ExpressionTransformer";

export class EventTransformer{
    static createEvents(expression:TypeDeclarationExpression|undefined, context:TransformerContext, type:Type){
        
        for (const event of expression?.events || []){
            const method = this.createEventFor(event, context, type);
            
            type.methods.push(method);
        }
    }

    static createEventFor(event:WhenDeclarationExpression, context:TransformerContext, type:Type){
        
        const possibleEventKinds = Array.from(new Set<string>(event.eventKind));

        const method = new Method();

        method.name = `~event`;
        method.actorType = event.actor;
        method.eventType = possibleEventKinds.map(x => this.transformEventKind(x, event.actor));
        method.returnType = BooleanType.typeName;

        if (event.target){
            method.targetTypes = event.target;
                        
            if (event.comparisonKind && event.comparisonKind != ComparisonType.None){
                method.comparisonType = <ComparisonType>event.comparisonKind;
            }

            if (event.locationConditions){
                method.locationConditions.push(...event.locationConditions.locationNames);
            }

            method.parameters.push(
                new Parameter(WorldObject.contextParameter, method.targetTypes.join('|'))
            );
        }

        if (event.choiceIndex){
            method.callIndex = event.choiceIndex - 1;
        }

        if (event.closures){
            method.closureParameters = event.closures.closureSources;
        }

        const instructions:Instruction[] = [];

        const actions = <ActionsExpression>event.actions;

        for(const action of actions.actions){
            const body = ExpressionTransformer.transformExpression(action, context, ExpressionTransformationMode.IgnoreResultsOfSayExpression);
            instructions.push(
                ...body                                    
            );
        }

        if (method.eventType.some(x => x == EventType.ItIsOpened)){
            instructions.push(
                ...Instruction.includeStateInThis(State.opened),
                ...Instruction.removeStateFromThis(State.closed)
            );
        } else if (method.eventType.some(x => x == EventType.ItIsClosed)){
            instructions.push(
                ...Instruction.includeStateInThis(State.closed),
                ...Instruction.removeStateFromThis(State.opened)
            );
        }

        // Event methods should be executed as overrides to existing methods because they
        // may want to pre-emptively abort the event chain with more specific conditions
        // than the base knows about, so we're calling base afterwards if they actually
        // made it to that point.

        method.body.push(
            ...instructions,            
            Instruction.baseTypeInstanceCall(),
            Instruction.return()
        );

        return method;
    }

    private static transformEventKind(kind:string, actor:string){
        switch(kind){
            case Keywords.enters: return EventType.PlayerEntersPlace;
            case Keywords.exits: return EventType.PlayerExitsPlace;
            case Keywords.taken: return EventType.ItIsTaken;
            case Keywords.given: return EventType.ItIsGiven;
            case Keywords.dropped: return EventType.ItIsDropped;
            case Keywords.used: return EventType.ItIsUsed;
            case Keywords.opened: return EventType.ItIsOpened;
            case Keywords.closed: return EventType.ItIsClosed;
            case Keywords.described: return EventType.ItIsDescribed;
            case Keywords.observed: return EventType.ItIsObserved;
            case Keywords.combined: return EventType.ItIsCombined;
            case Keywords.presses: return EventType.KeyIsPressed;
            case Keywords.selected: return EventType.OptionIsSelected;
            case Keywords.starts: return actor == Keywords.game ? EventType.GameIsStarted : EventType.PlayerIsStarted;
            case Keywords.ends: return actor == Keywords.game ? EventType.GameIsEnded : EventType.PlayerIsEnded;
            case Keywords.wins: return EventType.PlayerWins;
            case Keywords.fails: return EventType.PlayerFails;
            case Keywords.completes: return EventType.GameIsCompleted;
            case Keywords.set: return actor == Keywords.player ? EventType.PlayerIsSet : EventType.ValueIsSet;
            case Keywords.holds: return EventType.ItIsHeld;
            case Keywords.goes: return EventType.ItGoes;
            default:{
                throw new CompilationError(`Unable to transform unsupported event kind '${kind}'`);
            }
        }
    }
}