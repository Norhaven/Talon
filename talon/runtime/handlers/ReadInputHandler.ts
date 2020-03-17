import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { EvaluationResult } from "../EvaluationResult";

export class ReadInputHandler extends OpCodeHandler{
    handle(thread:Thread){
        return EvaluationResult.SuspendForInput;
    }
}