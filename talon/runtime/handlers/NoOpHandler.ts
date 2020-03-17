import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { EvaluationResult } from "../EvaluationResult";

export class NoOpHandler extends OpCodeHandler{
    handle(thread:Thread){
        return EvaluationResult.Continue;
    }
}