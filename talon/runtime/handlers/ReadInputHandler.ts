import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { EvaluationResult } from "../EvaluationResult";

export class ReadInputHandler extends OpCodeHandler{
    handle(thread:Thread){
        thread.log?.debug(".read.in");
        
        return EvaluationResult.SuspendForInput;
    }
}