import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class BranchRelativeHandler extends OpCodeHandler{
    handle(thread:Thread){
        const relativeAmount = <number>thread.currentInstruction?.value;

        thread.log?.debug(`br.rel ${relativeAmount}`);

        thread.jumpToLine(thread.currentMethod.stackFrame.currentInstruction + relativeAmount);
        
        return super.handle(thread);
    }
}