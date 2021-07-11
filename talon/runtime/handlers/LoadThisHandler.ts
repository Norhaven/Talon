import { OpCode } from "../../common/OpCode";
import { OpCodeHandler } from "../OpCodeHandler"
import { Thread } from "../Thread";

export class LoadThisHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.LoadThis;

    handle(thread:Thread){
        const instance = thread.currentMethod.method?.actualParameters[0].value!;

        thread.currentMethod.push(instance);

        this.logInteraction(thread);

        return super.handle(thread);
    }
}