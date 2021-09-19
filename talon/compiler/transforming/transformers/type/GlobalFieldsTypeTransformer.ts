import { Field } from "../../../../common/Field";
import { Type } from "../../../../common/Type";
import { BooleanType } from "../../../../library/BooleanType";
import { GlobalFields } from "../../../../library/GlobalFields";
import { Expression } from "../../../parsing/expressions/Expression";
import { ProgramExpression } from "../../../parsing/expressions/ProgramExpression";
import { ITypeTransformer } from "../../ITypeTransformer";
import { TransformerContext } from "../../TransformerContext";

export class GlobalFieldsTypeTransformer implements ITypeTransformer{
    transform(expression: Expression, context: TransformerContext): void {
        if (!(expression instanceof ProgramExpression)){
            return;
        }

        const globalFieldsTypeName = "~globalProgramFields";

        if (!context.typesByName.has(globalFieldsTypeName)){
            const type = new Type(globalFieldsTypeName, GlobalFields.typeName);
            context.typesByName.set(type.name, type);
        }
        
        const type = context.typesByName.get(globalFieldsTypeName);
        
        const isCancelledField = new Field();
        isCancelledField.name = GlobalFields.canRun;
        isCancelledField.typeName = BooleanType.typeName;
        isCancelledField.defaultValue = true;

        type?.fields.push(isCancelledField);
    }

}