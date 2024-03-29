import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { Memory } from "../common/Memory";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { Variable } from "../library/Variable";
import { RuntimeAny } from "../library/RuntimeAny";
import { MethodActivation } from "../MethodActivation";
import { Type } from "../../common/Type";
import { OpCode } from "../../common/OpCode";
import { RuntimeError } from "../errors/RuntimeError";
import { Stopwatch } from "../../Stopwatch";

export class InstanceCallHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.InstanceCall;

    constructor(private methodName?:string){
        super();
    }

    handle(thread:Thread){

        const current = thread.currentMethod;

        if (!this.methodName){
            this.methodName = <string>thread.currentInstruction?.value!;
        }

        return Stopwatch.measure(`InstanceCall.${this.methodName}`, () => {
            try{
                const instance = current.pop();

                const method = this.getMostDerivedMethodFrom(instance!, this.methodName!);

                this.logInteraction(thread, `${instance?.typeName}::${this.methodName}(...${method.parameters.length})`);
                
                const parameterValues:Variable[] = [];

                for(let i = 0; i < method!.parameters.length; i++){
                    const parameter = method!.parameters[i];
                    const instance = current.pop()!;
                    const variable = new Variable(parameter.name, parameter.type!, instance);

                    parameterValues.push(variable);
                }
                
                // HACK: We shouldn't create our own type, we should inherently know what it is.

                parameterValues.unshift(Variable.forThis(instance!));

                method.actualParameters = parameterValues;

                thread.activateMethod(method);
            } finally {
                this.methodName = undefined;
            }

            return super.handle(thread);
        });
    }
}