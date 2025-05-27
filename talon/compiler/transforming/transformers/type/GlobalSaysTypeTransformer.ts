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
    constructor(private readonly context: TransformerContext){
    }

    transform(expression: Expression): void {
        if (!(expression instanceof ProgramExpression)){
            return;
        }

        const globalSaysTypeName = "~globalSays";

        const type = this.context.getOrAddType(globalSaysTypeName, Say.typeName);

        const globalSays = expression.expressions.filter(x => x instanceof SayExpression);
        
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