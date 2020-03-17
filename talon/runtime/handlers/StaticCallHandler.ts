import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { MethodActivation } from "../MethodActivation";

export class StaticCallHandler extends OpCodeHandler{
    handle(thread:Thread){
        const callText = <string>thread.currentInstruction?.value!;

        const pieces = callText.split(".");

        const typeName = pieces[0];
        const methodName = pieces[1];

        const type = thread.knownTypes.get(typeName)!;
        const method = type?.methods.find(x => x.name === methodName)!;       
        
        thread.log?.debug(`call.static\t${typeName}::${methodName}()`);

        thread.activateMethod(method);

        return super.handle(thread);
    }
}