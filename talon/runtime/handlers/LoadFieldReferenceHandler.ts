import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class LoadFieldReferenceHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.LoadFieldReference;

    handle(thread:Thread){
        const instance = thread.currentMethod.pop()!;
        const fieldName = thread.currentInstructionValueAs<string>();

        if (!instance){
            throw new RuntimeError(`Unable to load field type for field '${fieldName}' without a valid instance`);
        }

        const field = this.getMostDerivedFieldFrom(instance, fieldName);

        if (!field){
            throw new RuntimeError(`Unable to load field type for unknown field '${instance.typeName}::${fieldName}'`);
        }

        this.logInteraction(thread, `${instance?.typeName}::${fieldName}:${field?.type.name}`, '//', typeof field.value, field.value);

        thread.currentMethod.push(Memory.allocateVariableReference(field, instance));

        return super.handle(thread);
    }    
}