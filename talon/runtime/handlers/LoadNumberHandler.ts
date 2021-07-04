import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { Memory } from "../common/Memory";
import { OpCode } from "../../common/OpCode";

export class LoadNumberHandler extends OpCodeHandler{
    protected code: OpCode = OpCode.LoadNumber;

    handle(thread:Thread){

        const value = <number>thread.currentInstruction?.value!;
        const runtimeValue = Memory.allocateNumber(value);

        thread.currentMethod.push(runtimeValue);

        this.logInteraction(thread, value);

        return super.handle(thread);
    }
}