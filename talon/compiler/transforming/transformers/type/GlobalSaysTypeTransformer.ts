import { Instruction } from "../../../../common/Instruction";
import { Method } from "../../../../common/Method";
import { Type } from "../../../../common/Type";
import { Say } from "../../../../library/Say";
import { Expression } from "../../../parsing/expressions/Expression";
import { ProgramExpression } from "../../../parsing/expressions/ProgramExpression";
import { SayExpression } from "../../../parsing/expressions/SayExpression";
import { ITypeTransformer } from "../../ITypeTransformer";
import { TransformerContext } from "../../TransformerContext";

export class GlobalSaysTypeTransformer implements ITypeTransformer{
    transform(expression: Expression, context: TransformerContext): void {
        if (!(expression instanceof ProgramExpression)){
            return;
        }

        const globalSaysTypeName = "~globalSays";

        if (!context.typesByName.has(globalSaysTypeName)){
            const type = new Type(globalSaysTypeName, Say.typeName);
            context.typesByName.set(type.name, type);
        }

        const globalSays = expression.expressions.filter(x => x instanceof SayExpression);

        
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