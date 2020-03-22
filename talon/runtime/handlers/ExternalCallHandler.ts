import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeAny } from "../library/RuntimeAny";

interface IIndexable{
    [name:string]:(...args:RuntimeAny[])=>RuntimeAny;
}

export class ExternalCallHandler extends OpCodeHandler{
    
    handle(thread:Thread){

        const methodName = <string>thread.currentInstruction?.value!;

        const instance = thread.currentMethod.pop();
        
        const method = this.locateFunction(instance!, <string>methodName);

        thread.log?.debug(`.call.extern\t${instance?.typeName}::${methodName}(...${method.length})`);

        const args:RuntimeAny[] = [];

        for(let i = 0; i < method.length; i++){
            args.push(thread.currentMethod.pop()!);
        }

        const result = method.call(instance, ...args);

        thread.currentMethod.push(result);

        return super.handle(thread);
    }

    private locateFunction(instance:Object, methodName:string){
        return (<IIndexable>instance)[methodName];
    }
}