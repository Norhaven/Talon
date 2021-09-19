import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeAny } from "../library/RuntimeAny";
import { OpCode } from "../../common/OpCode";

interface IIndexable{
    [name:string]:(...args:RuntimeAny[])=>RuntimeAny;
}

export class ExternalCallHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.ExternalCall;
    
    handle(thread:Thread){

        const methodName = <string>thread.currentInstruction?.value!;
        const instance = thread.currentMethod.pop();
        
        const method = this.locateFunction(instance!, <string>methodName);

        this.logInteraction(thread, `${instance?.typeName}::${methodName}(...${method.length})`);
        thread.logStructured("External method {name} invoked: {@method}", methodName, method);

        const args:RuntimeAny[] = [];

        for(let i = 0; i < method.length; i++){
            args.push(thread.currentMethod.pop()!);
        }

        const result = method.call(instance, ...args);

        if (result){
            thread.currentMethod.push(result);
        }

        return super.handle(thread);
    }

    private locateFunction(instance:Object, methodName:string){
        return (<IIndexable>instance)[methodName];
    }
}