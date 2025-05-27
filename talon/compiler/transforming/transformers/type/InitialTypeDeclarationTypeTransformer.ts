import { Type } from "../../../../common/Type";
import { Any } from "../../../../library/Any";
import { CompilationError } from "../../../exceptions/CompilationError";
import { Expression } from "../../../parsing/expressions/Expression";
import { TypeDeclarationExpression } from "../../../parsing/expressions/TypeDeclarationExpression";
import { ITypeTransformer } from "../../ITypeTransformer";
import { TransformerContext } from "../../TransformerContext";

export class InitialTypeDeclarationTypeTransformer implements ITypeTransformer{
    constructor(private readonly context:TransformerContext){

    }

    transform(expression: Expression): void {
        if (!(expression instanceof TypeDeclarationExpression)){
            return;
        }

        const type = new Type(expression.name, expression.baseType!.name);

        if (this.context.hasType(expression.name)){
            throw new CompilationError(`A declared type '${type.name}' has the same name as another type and needs to be renamed to be unique`);
        }

        this.context.addType(expression.name, expression.baseType?.name || Any.typeName);
    }
}