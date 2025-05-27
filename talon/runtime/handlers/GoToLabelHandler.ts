import { OpCode } from "../../common/OpCode";
import { RuntimeError } from "../errors/RuntimeError";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class GoToLabelHandler extends OpCodeHandler{
    public readonly code = OpCode.GoToLabel;

    handle(thread:Thread){

        const label = thread.currentInstruction?.value;

        if (!label){
            throw new RuntimeError("Unable to go to label with no label name")
        }

        const labeledInstructionIndex = thread.currentMethod.method?.body.findIndex(x => x.label == label) || -1;

        if (labeledInstructionIndex == -1){
            throw new RuntimeError(`Unable to locate instruction labeled '${label}' within method '${thread.currentMethod.method?.signature}'`);
        }

        thread.jumpToLine(labeledInstructionIndex);
        
        return super.handle(thread);
    }
}