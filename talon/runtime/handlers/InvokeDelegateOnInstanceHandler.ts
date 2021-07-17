import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeDelegate } from "../library/RuntimeDelegate";
import { Variable } from "../library/Variable";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class InvokeDelegateOnInstanceHandler extends OpCodeHandler{
    public code: OpCode = OpCode.InvokeDelegateOnInstance;

    handle(thread:Thread){

        const delegate = thread.currentMethod.pop()!;
        const instance = thread.currentMethod.pop()!;

        this.logInteraction(thread, `~anon(${instance.typeName})`);

        if (delegate instanceof RuntimeDelegate){
            const type = Memory.findTypeByName(instance.typeName)!;
            const actualParametersWithoutThis = delegate.wrappedMethod.actualParameters.filter(x => x.name != "~this");

            actualParametersWithoutThis.push(
                Variable.forThis(type, instance)
            );

            delegate.wrappedMethod.actualParameters = actualParametersWithoutThis;

            const activation = thread.activateMethod(delegate.wrappedMethod);
        } else {
            throw new RuntimeError(`Unable to invoke delegate for non-delegate instance '${delegate}'`);
        }

        return super.handle(thread);
    }
}