import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { RuntimeError } from "../errors/RuntimeError";

export class GoToHandler extends OpCodeHandler{
    handle(thread:Thread){

        const instructionNumber = thread.currentInstruction?.value;

        if (typeof instructionNumber === "number"){
            // We need to jump one previous to the desired instruction because after 
            // evaluating this goto we'll move forward (which will move to the desired one).

            thread.jumpToLine(instructionNumber - 1);
        } else{
            throw new RuntimeError("Unable to goto");
        }

        return super.handle(thread);
    }
}