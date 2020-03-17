import { Thread } from "./Thread";
import { OpCode } from "../common/OpCode";
import { EvaluationResult } from "./EvaluationResult";

export class OpCodeHandler{
    code:OpCode = OpCode.NoOp;

    handle(thread:Thread){
        return EvaluationResult.Continue;
    }
}