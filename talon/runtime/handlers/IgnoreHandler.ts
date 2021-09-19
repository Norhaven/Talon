import { OpCode } from "../../common/OpCode";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class IgnoreHandler extends OpCodeHandler{
    public code: OpCode = OpCode.Ignore;

    handle(thread:Thread){
        const value = thread.currentMethod.pop();

        this.logInteraction(thread, value);

        return super.handle(thread);
    }
}