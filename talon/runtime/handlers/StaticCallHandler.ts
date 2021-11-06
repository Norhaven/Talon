import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { MethodActivation } from "../MethodActivation";
import { OpCode } from "../../common/OpCode";
import { Stopwatch } from "../../Stopwatch";

export class StaticCallHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.StaticCall;

    handle(thread:Thread){
        const callText = <string>thread.currentInstruction?.value!;

        return Stopwatch.measure(`StaticCall.${callText}`, () => {
            const pieces = callText.split(".");

            const typeName = pieces[0];
            const methodName = pieces[1];

            const type = thread.knownTypes.get(typeName)!;
            const method = type?.methods.find(x => x.name === methodName)!;       
            
            this.logInteraction(thread, `${typeName}::${methodName}()`);

            thread.activateMethod(method);

            return super.handle(thread);
        });
    }
}