import { Instruction } from "../../../../common/Instruction";
import { Method } from "../../../../common/Method";
import { Type } from "../../../../common/Type";
import { Any } from "../../../../library/Any";
import { Expression } from "../../../parsing/expressions/Expression";
import { ProgramExpression } from "../../../parsing/expressions/ProgramExpression";
import { TypeDeclarationExpression } from "../../../parsing/expressions/TypeDeclarationExpression";
import { WhenDeclarationExpression } from "../../../parsing/expressions/WhenDeclarationExpression";
import { ITypeTransformer } from "../../ITypeTransformer";
import { TransformerContext } from "../../TransformerContext";

export class GlobalWhenTypeTransformer implements ITypeTransformer{
    transform(expression: Expression, context: TransformerContext): void {
        if (!(expression instanceof ProgramExpression)){
            return;
        }

        const globalSaysTypeName = "~globalEvents";

        if (!context.typesByName.has(globalSaysTypeName)){
            const type = new Type(globalSaysTypeName, Any.typeName);
            context.typesByName.set(type.name, type);
        }

        const globalSays = expression.expressions.filter(x => x instanceof WhenDeclarationExpression);

        
        const type = context.typesByName.get(globalSaysTypeName);
        
        const method = new Method();
        method.name = Say.typeName;
        method.parameters = [];

        const instructions:Instruction[] = [];

        for(const say of globalSays){
            const sayExpression = <SayExpression>say;

            instructions.push(
                Instruction.loadString(sayExpression.text),
                Instruction.print()
            );
        }

        instructions.push(Instruction.return());

        method.body = instructions;

        type?.methods.push(method);
    }

}