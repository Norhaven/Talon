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

        const typeAndMethod = thread.currentInstructionValueAs<string>();
        const implicitThis = thread.currentMethod.pop();
        
        this.logInteraction(thread, typeAndMethod);

        const parts = typeAndMethod.split(':');
        const typeName = parts[0];
        const methodName = parts[1];

        const type = Memory.findTypeByName(typeName)!;
        const method = type.methods.find(method => method.name == methodName)!;

        method.actualParameters.push(
            Variable.forThis(type, implicitThis)
        );

        const delegate = new RuntimeDelegate(method);

        thread.currentMethod.push(delegate);

        return super.handle(thread);
    }
}