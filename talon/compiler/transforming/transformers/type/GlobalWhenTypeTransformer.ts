import { Instruction } from "../../../../common/Instruction";
import { Method } from "../../../../common/Method";
import { Type } from "../../../../common/Type";
import { Any } from "../../../../library/Any";
import { GlobalEvents } from "../../../../library/GlobalEvents";
import { Expression } from "../../../parsing/expressions/Expression";
import { ProgramExpression } from "../../../parsing/expressions/ProgramExpression";
import { TypeDeclarationExpression } from "../../../parsing/expressions/TypeDeclarationExpression";
import { WhenDeclarationExpression } from "../../../parsing/expressions/WhenDeclarationExpression";
import { ITypeTransformer } from "../../ITypeTransformer";
import { TransformerContext } from "../../TransformerContext";
import { EventTransformer } from "../events/EventTransformer";

export class GlobalWhenTypeTransformer implements ITypeTransformer{
    transform(expression: Expression, context: TransformerContext): void {
        if (!(expression instanceof ProgramExpression)){
            return;
        }

        if (!context.typesByName.has(GlobalEvents.typeName)){
            const type = new Type(GlobalEvents.typeName, GlobalEvents.parentTypeName);
            context.typesByName.set(type.name, type);
        }

        const globalEvents = expression.expressions.filter(x => x instanceof WhenDeclarationExpression);
        
        const type = context.typesByName.get(GlobalEvents.typeName)!;
        
        for(const event of globalEvents){
            const method = EventTransformer.createEventFor(<WhenDeclarationExpression>event, context);

            type?.methods.push(method);
        }        
    }
}