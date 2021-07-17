import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class AddHandler extends OpCodeHandler{
    public code: OpCode = OpCode.Add;

    handle(thread:Thread){
        this.logInteraction(thread);

        const first = <RuntimeInteger>thread.currentMethod.pop();
        const second = <RuntimeInteger>thread.currentMethod.pop();

        const added = Memory.allocateNumber(first.value + second.value);

        thread.currentMethod.push(added);
        
        return super.handle(thread);
    }
}