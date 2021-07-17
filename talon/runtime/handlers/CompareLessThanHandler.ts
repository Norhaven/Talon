import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class CompareLessThanHandler extends OpCodeHandler{
    public code: OpCode = OpCode.CompareLessThan;

    handle(thread:Thread){
        this.logInteraction(thread);

        const firstValue = <RuntimeInteger>thread.currentMethod.pop();
        const secondValue = <RuntimeInteger>thread.currentMethod.pop();

        const isLessThan = Memory.allocateBoolean(firstValue.value < secondValue.value);

        thread.currentMethod.push(isLessThan);

        return super.handle(thread);
    }
}