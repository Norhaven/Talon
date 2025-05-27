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
    constructor(private readonly context: TransformerContext){
    }

    transform(expression: Expression): void {
        if (!(expression instanceof ProgramExpression)){
            return;
        }

        const type = this.context.getOrAddType(GlobalEvents.typeName, GlobalEvents.parentTypeName);

        const globalEvents = expression.expressions.filter(x => x instanceof WhenDeclarationExpression);
        
        for(const event of globalEvents){
            const method = EventTransformer.createEventFor(<WhenDeclarationExpression>event, this.context, type);

            type.methods.push(method);
        }        
    }
}