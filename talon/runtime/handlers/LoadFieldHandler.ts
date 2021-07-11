import { OpCode } from "../../common/OpCode";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class LoadFieldHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.LoadField;

    handle(thread:Thread){
        const instance = thread.currentMethod.pop();
        const fieldName = thread.currentInstructionValueAs<string>();

        const field = instance?.fields.get(fieldName);

        const value = field?.value;

        this.logInteraction(thread, `${instance?.typeName}::${fieldName}:${field?.type.name}`, '//', typeof value, value);

        thread.currentMethod.push(value!);

        return super.handle(thread);
    }
}