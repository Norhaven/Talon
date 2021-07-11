import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class LoadBooleanHandler extends OpCodeHandler{
    public code: OpCode = OpCode.LoadBoolean;

    handle(thread:Thread){
        const value = <boolean>thread.currentInstruction?.value!;
        const runtimeValue = Memory.allocateBoolean(value);

        thread.currentMethod.push(runtimeValue);

        this.logInteraction(thread, value);

        return super.handle(thread);
    }
}