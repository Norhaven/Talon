import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { EvaluationResult } from "../EvaluationResult";
import { OpCode } from "../../common/OpCode";

export class NoOpHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.NoOp;

    handle(thread:Thread){
        this.logInteraction(thread);

        return super.handle(thread);
    }
}