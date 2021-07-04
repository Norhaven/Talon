import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeString } from "../library/RuntimeString";
import { Memory } from "../common/Memory";
import { OpCode } from "../../common/OpCode";

export class ConcatenateHandler extends OpCodeHandler{
    protected code: OpCode = OpCode.Concatenate;

    handle(thread:Thread){
        const last = <RuntimeString>thread.currentMethod.pop();
        const first = <RuntimeString>thread.currentMethod.pop();

        this.logInteraction(thread, first.value, last.value);

        const concatenated = Memory.allocateString(first.value + " " + last.value);

        thread.currentMethod.push(concatenated);

        return super.handle(thread);
    }
}