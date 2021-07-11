import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeBoolean } from "../library/RuntimeBoolean";
import { OpCode } from "../../common/OpCode";

export class BranchRelativeIfFalseHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.BranchRelativeIfFalse;

    handle(thread:Thread){
        const relativeAmount = <number>thread.currentInstruction?.value;
        const value = <RuntimeBoolean>thread.currentMethod.pop();

        this.logInteraction(thread, relativeAmount, '//', value);

        if (!value.value){            
            thread.jumpToLine(thread.currentMethod.stackFrame.currentInstruction + relativeAmount);
        }
        
        return super.handle(thread);
    }
}