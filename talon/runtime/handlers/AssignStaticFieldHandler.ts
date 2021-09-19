import { OpCode } from "../../common/OpCode";
import { BooleanType } from "../../library/BooleanType";
import { StringType } from "../../library/StringType";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeBoolean } from "../library/RuntimeBoolean";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { RuntimeString } from "../library/RuntimeString";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class AssignStaticFieldHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.AssignStaticField;

    handle(thread:Thread){

        const typeAndFieldName = thread.currentInstructionValueAs<string>();
        const value = thread.currentMethod.pop();

        this.logInteraction(thread, typeAndFieldName, value);

        const parts = typeAndFieldName.split('.');
        const typeName = parts[0];
        const fieldName = parts[1];

        const type = Memory.findTypeByName(typeName);
        const field = type?.fields.find(x => x.name.toLowerCase() === fieldName.toLowerCase());
        
        if (field?.typeName === BooleanType.typeName){
            field.defaultValue = (<RuntimeBoolean>value).value;
        } else {
            throw new RuntimeError(`Attempted to set static field '${field?.name}' with unsupported type '${field?.typeName}'`);
        }

        return super.handle(thread);
    }
}