import { EventType } from "../../../../common/EventType";
import { Instruction } from "../../../../common/Instruction";
import { Method } from "../../../../common/Method";
import { Parameter } from "../../../../common/Parameter";
import { States } from "../../../../common/States";
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
    static createEvents(expression:TypeDeclarationExpression, context:TransformerContext, type:Type){
        
        for (const event of expression.events){
            const method = this.createEventFor(event, context);
            
            type.methods.push(method);
        }
    }

    static createEventFor(event:WhenDeclarationExpression, context:TransformerContext){
        
        const method = new Method();

        method.name = `~event_${event.actor}_${event.eventKind}`;
        method.eventType = this.transformEventKind(event.eventKind);
        method.returnType = BooleanType.typeName;

        if (event.target){
            method.name = `${method.name}_${event.target}`;
            
            method.parameters.push(
                new Parameter(WorldObject.contextParameter, event.target)
            );
        }

        const instructions:Instruction[] = [];

        const actions = <ActionsExpression>event.actions;

        for(const action of actions.actions){
            const body = ExpressionTransformer.transformExpression(action, ExpressionTransformationMode.IgnoreResultsOfSayExpression);
            instructions.push(
                ...body                                    
            );
        }

        if (method.eventType == EventType.ItIsOpened){
            instructions.push(
                ...Instruction.includeStateInThis(States.opened),
                ...Instruction.removeStateFromThis(States.closed)
            );
        } else if (method.eventType == EventType.ItIsClosed){
            instructions.push(
                ...Instruction.includeStateInThis(States.closed),
                ...Instruction.removeStateFromThis(States.opened)
            );
        }

        instructions.push(
            Instruction.loadBoolean(true),
            Instruction.return()
        );

        method.body.push(
            Instruction.baseTypeInstanceCall(),
            ...Instruction.ifTrueThen(
                ...instructions
            ),
            Instruction.loadBoolean(false),
            Instruction.return()
        );

        return method;
    }

    private static transformEventKind(kind:string){
        switch(kind){
            case Keywords.enters: return EventType.PlayerEntersPlace;
            case Keywords.exits: return EventType.PlayerExitsPlace;
            case Keywords.taken: return EventType.ItIsTaken;
            case Keywords.dropped: return EventType.ItIsDropped;
            case Keywords.used: return EventType.ItIsUsed;
            case Keywords.opened: return EventType.ItIsOpened;
            case Keywords.closed: return EventType.ItIsClosed;
            case Keywords.described: return EventType.ItIsDescribed;
            case Keywords.observed: return EventType.ItIsObserved;
            case Keywords.combined: return EventType.ItIsCombined;
            case Keywords.presses: return EventType.KeyIsPressed;
            default:{
                throw new CompilationError(`Unable to transform unsupported event kind '${kind}'`);
            }
        }
    }
}