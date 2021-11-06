import { Type } from "../../../../common/Type";
import { CompilationError } from "../../../exceptions/CompilationError";
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

        if (context.typesByName.has(type.name)){
            throw new CompilationError(`A declared type '${type.name}' has the same name as another type and needs to be renamed to be unique`);
        }

        context.typesByName.set(type.name, type);
    }
}