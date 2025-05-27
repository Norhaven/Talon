import { Field } from "../../../../common/Field";
import { Type } from "../../../../common/Type";
import { BooleanType } from "../../../../library/BooleanType";
import { GlobalFields } from "../../../../library/GlobalFields";
import { Expression } from "../../../parsing/expressions/Expression";
import { ProgramExpression } from "../../../parsing/expressions/ProgramExpression";
import { ITypeTransformer } from "../../ITypeTransformer";
import { TransformerContext } from "../../TransformerContext";

export class GlobalFieldsTypeTransformer implements ITypeTransformer{
    constructor(private readonly context: TransformerContext){
    }

    transform(expression: Expression): void {
        if (!(expression instanceof ProgramExpression)){
            return;
        }

        const globalFieldsTypeName = "~globalProgramFields";

        const type = this.context.getOrAddType(globalFieldsTypeName, GlobalFields.typeName);
        
        const isCancelledField = new Field();
        isCancelledField.name = GlobalFields.canRun;
        isCancelledField.typeName = BooleanType.typeName;
        isCancelledField.defaultValue = true;

        type?.fields.push(isCancelledField);
    }

}