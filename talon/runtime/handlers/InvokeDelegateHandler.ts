import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeDelegate } from "../library/RuntimeDelegate";
import { RuntimeError } from "../errors/RuntimeError";
import { OpCode } from "../../common/OpCode";

export class InvokeDelegateHandler extends OpCodeHandler{
    protected code: OpCode = OpCode.InvokeDelegate;

    handle(thread:Thread){

        this.logInteraction(thread);
        
        const instance = thread.currentMethod.pop()!;

        if (instance instanceof RuntimeDelegate){
            const activation = thread.activateMethod(instance.wrappedMethod);
        } else {
            throw new RuntimeError(`Unable to invoke delegate for non-delegate instance '${instance}'`);
        }
        
        return super.handle(thread);
    }
}