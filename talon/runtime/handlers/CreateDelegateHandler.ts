import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeDelegate } from "../library/RuntimeDelegate";
import { Variable } from "../library/Variable";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class CreateDelegateHandler extends OpCodeHandler{
    public code: OpCode = OpCode.CreateDelegate;

    handle(thread:Thread){

        const methodName = thread.currentInstructionValueAs<string>();
        const implicitThis = thread.currentMethod.pop();
        
        this.logInteraction(thread, implicitThis?.typeName, methodName);

        const method = implicitThis?.methods.get(methodName)!;

        method.actualParameters[0] = Variable.forThis(Memory.findTypeByName(implicitThis?.typeName!)!, implicitThis);

        const delegate = new RuntimeDelegate(method);

        thread.currentMethod.push(delegate);

        return super.handle(thread);
    }
}