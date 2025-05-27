import { Field } from "../../../../common/Field";
import { Type } from "../../../../common/Type";
import { Understanding } from "../../../../library/Understanding";
import { CompilationError } from "../../../exceptions/CompilationError";
import { Expression } from "../../../parsing/expressions/Expression";
import { UnderstandingDeclarationExpression } from "../../../parsing/expressions/UnderstandingDeclarationExpression";
import { ITypeTransformer } from "../../ITypeTransformer";
import { TransformerContext } from "../../TransformerContext";

export class UnderstandingTypeTransformer implements ITypeTransformer{
    constructor(private readonly context:TransformerContext){
    }

    transform(expression: Expression): void {
        if (!(expression instanceof UnderstandingDeclarationExpression)){
            return;
        }

        // We're using the Understanding type name for both the name and the parent because this
        // is a dynamic type that needs to descend from the Understanding type and has no real
        // name of its own.
        
        const type = this.context.addDynamicType(Understanding.typeName, Understanding.typeName);
            
        const action = new Field();
        action.name = Understanding.action;
        action.defaultValue = expression.values;

        const meaning = new Field();
        meaning.name = Understanding.meaning;
        meaning.defaultValue = expression.meaning;
        
        type.fields.push(action);
        type.fields.push(meaning);
    }
}