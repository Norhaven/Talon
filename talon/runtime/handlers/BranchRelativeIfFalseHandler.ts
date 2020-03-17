import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeBoolean } from "../library/RuntimeBoolean";

export class BranchRelativeIfFalseHandler extends OpCodeHandler{
    handle(thread:Thread){
        const relativeAmount = <number>thread.currentInstruction?.value;
        const value = <RuntimeBoolean>thread.currentMethod.pop();

        if (!value.value){
            thread.jumpToLine(thread.currentMethod.stackFrame.currentInstruction + relativeAmount);
        }
        
        return super.handle(thread);
    }
}