import { OpCode } from "../../common/OpCode";
import { EvaluationResult } from "../EvaluationResult";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class BranchRelativeHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.BranchRelative;

    handle(thread:Thread){
        const relativeAmount = <number>thread.currentInstruction?.value;

        this.logInteraction(thread, relativeAmount);

        thread.jumpToLine(thread.currentMethod.stackFrame.currentInstruction + relativeAmount);
        
        return super.handle(thread);
    }
}