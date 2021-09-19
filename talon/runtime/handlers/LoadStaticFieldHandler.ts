import { OpCode } from "../../common/OpCode";
import { BooleanType } from "../../library/BooleanType";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class LoadStaticFieldHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.LoadStaticField;

    handle(thread:Thread){
        const typeAndFieldName = thread.currentInstructionValueAs<string>();
        const parts = typeAndFieldName.split('.');

        const typeName = parts[0];
        const fieldName = parts[1];

        const type = Memory.findTypeByName(typeName)!;
        const field = type.fields.find(x => x.name.toLowerCase() === fieldName.toLowerCase());

        const value = field?.defaultValue;

        this.logInteraction(thread, `${typeName}::${fieldName}:${field?.typeName}`, '//', typeof value, value);

        if (field?.typeName === BooleanType.typeName){
            const runtimeValue = Memory.allocateBoolean(<boolean>value);
            thread.currentMethod.push(runtimeValue);
        } else {
            throw new RuntimeError(`Attempted to load static field '${field?.name}' of unsupported type '${field?.typeName}'`);
        }

        return super.handle(thread);
    }    
}