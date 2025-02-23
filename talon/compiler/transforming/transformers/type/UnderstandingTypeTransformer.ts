import { Field } from "../../../../common/Field";
import { Type } from "../../../../common/Type";
import { Understanding } from "../../../../library/Understanding";
import { CompilationError } from "../../../exceptions/CompilationError";
import { Expression } from "../../../parsing/expressions/Expression";
import { UnderstandingDeclarationExpression } from "../../../parsing/expressions/UnderstandingDeclarationExpression";
import { ITypeTransformer } from "../../ITypeTransformer";
import { TransformerContext } from "../../TransformerContext";

export class UnderstandingTypeTransformer implements ITypeTransformer{
    transform(expression: Expression, context:TransformerContext): void {
        if (!(expression instanceof UnderstandingDeclarationExpression)){
            return;
        }

        const type = new Type(`~${Understanding.typeName}_${context.dynamicTypeCount}`, Understanding.typeName);
            
        const action = new Field();
        action.name = Understanding.action;
        action.defaultValue = expression.values;

        const meaning = new Field();
        meaning.name = Understanding.meaning;
        meaning.defaultValue = expression.meaning;
        
        type.fields.push(action);
        type.fields.push(meaning);

        context.dynamicTypeCount++;

        context.typesByName.set(type.name, type);
    }
}