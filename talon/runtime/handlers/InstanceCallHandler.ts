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

export class InstanceCallHandler extends OpCodeHandler{
    protected code: OpCode = OpCode.InstanceCall;

    constructor(private methodName?:string){
        super();
    }

    handle(thread:Thread){

        const current = thread.currentMethod;

        if (!this.methodName){
            this.methodName = <string>thread.currentInstruction?.value!;
        }

        const instance = current.pop();

        const method = instance?.methods.get(this.methodName)!;

        this.logInteraction(thread, `${instance?.typeName}::${this.methodName}(...${method.parameters.length})`);
        
        const parameterValues:Variable[] = [];

        for(let i = 0; i < method!.parameters.length; i++){
            const parameter = method!.parameters[i];
            const instance = current.pop()!;
            const variable = new Variable(parameter.name, parameter.type!, instance);

            parameterValues.push(variable);
        }
        
        // HACK: We shouldn't create our own type, we should inherently know what it is.

        parameterValues.unshift(Variable.forThis(new Type(instance?.typeName!, instance?.parentTypeName!), instance));

        method.actualParameters = parameterValues;

        thread.activateMethod(method);

        return super.handle(thread);
    }
}