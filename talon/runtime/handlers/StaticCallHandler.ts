import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { MethodActivation } from "../MethodActivation";
import { OpCode } from "../../common/OpCode";
import { Stopwatch } from "../../Stopwatch";
import { WorldObject } from "../../library/WorldObject";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeAny } from "../library/RuntimeAny";
import { Variable } from "../library/Variable";
import { Memory } from "../common/Memory";

export class StaticCallHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.StaticCall;

    handle(thread:Thread){
        const callText = <string>thread.currentInstruction?.value!;

        return Stopwatch.measure(`StaticCall.${callText}`, () => {
            const pieces = callText.split(".");

            const typeName = pieces[0];
            const methodName = pieces[1];
            const hasContextParameter = pieces[2] == 'true';

            const type = thread.knownTypes.get(typeName)!;
            const method = type?.methods.find(x => x.signature === methodName)!;

            this.logInteraction(thread, `${typeName}::${methodName}()`);
            
            if (hasContextParameter){
                const contextParameter = method.parameters.find(x => x.name == WorldObject.contextParameter);

                if (!contextParameter || !contextParameter.typeName){
                    throw new RuntimeError(`Static method ${typeName}::${methodName}() does not contain the expected context parameter`);
                }

                const context = <RuntimeAny|undefined>thread.currentMethod.pop();

                const parameterType = Memory.findTypeByName(contextParameter.typeName);

                if (!parameterType){
                    throw new RuntimeError(`Unable to locate a concrete type for context parameter in static call '${callText}'`);
                }

                method.actualParameters = [new Variable(WorldObject.contextParameter, parameterType, context)];
            }

            thread.activateMethod(method);

            return super.handle(thread);
        });
    }
}