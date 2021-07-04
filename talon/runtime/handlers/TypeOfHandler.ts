import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { Memory } from "../common/Memory";
import { OpCode } from "../../common/OpCode";

export class TypeOfHandler extends OpCodeHandler{
    protected code: OpCode = OpCode.TypeOf;

    handle(thread:Thread){
        const typeName = <string>thread.currentInstruction?.value!;

        this.logInteraction(thread, typeName);

        if (thread.currentMethod.stackSize() == 0){
            const value = Memory.allocateBoolean(false);
            thread.currentMethod.push(value);
        } else {
            const instance = thread.currentMethod.peek();

            const isType = instance?.typeName == typeName;
            const result = Memory.allocateBoolean(isType);

            thread.currentMethod.push(result);
        }

        return super.handle(thread);
    }
}