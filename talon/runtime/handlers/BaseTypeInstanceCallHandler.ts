import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeAny } from "../library/RuntimeAny";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { InstanceCallHandler } from "./InstanceCallHandler";

export class BaseTypeInstanceCallHandler extends OpCodeHandler{
    public code: OpCode = OpCode.BaseTypeInstanceCall;

    handle(thread:Thread){
        const methodName = thread.currentMethod.method?.signature!;
        const thisInstance = thread.currentMethod.method?.actualParameters[0];

        this.logInteraction(thread, methodName, thisInstance?.value?.typeName);
        
        if (!thisInstance?.value?.base){
            throw new RuntimeError(`Unable to call base method '${methodName}' on type '${thisInstance?.value?.typeName}' with no base type`);
        }

        const method = this.getMostDerivedMethodOrUndefinedFrom(thisInstance.value.base, methodName);

        if (!method){
            const result = Memory.allocateBoolean(true);
            thread.currentMethod.push(result);

            return super.handle(thread);
        }

        thread.currentMethod.push(thisInstance?.value?.base!);

        const handler = new InstanceCallHandler(methodName);

        return handler.handle(thread);
    }

    private getMostDerivedMethodOrUndefinedFrom(instance:RuntimeAny|null, methodName:string){
        for(let current = instance;
            current;
            current = current.base){
            
            const method = current.methods.get(methodName);

            if (method){
                return method;
            }
        }

        return undefined;
    }
}