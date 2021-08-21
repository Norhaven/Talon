import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeDelegate } from "../library/RuntimeDelegate";
import { RuntimeError } from "../errors/RuntimeError";
import { OpCode } from "../../common/OpCode";
import { Variable } from "../library/Variable";
import { Type } from "../../common/Type";

export class InvokeDelegateHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.InvokeDelegate;

    handle(thread:Thread){

        this.logInteraction(thread);
        
        const delegate = thread.currentMethod.pop()!;

        if (delegate instanceof RuntimeDelegate){            
            const activation = thread.activateMethod(delegate.wrappedMethod);
        } else {
            throw new RuntimeError(`Unable to invoke delegate for non-delegate instance '${delegate}'`);
        }
        
        return super.handle(thread);
    }
}