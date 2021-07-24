import { Type } from "../../../../common/Type";
import { Expression } from "../../../parsing/expressions/Expression";
import { TypeDeclarationExpression } from "../../../parsing/expressions/TypeDeclarationExpression";
import { ITypeTransformer } from "../../ITypeTransformer";
import { TransformerContext } from "../../TransformerContext";

export class InitialTypeDeclarationTypeTransformer implements ITypeTransformer{
    transform(expression: Expression, context: TransformerContext): void {
        if (!(expression instanceof TypeDeclarationExpression)){
            return;
        }

        const type = new Type(expression.name, expression.baseType!.name);

        context.typesByName.set(type.name, type);
    }

}