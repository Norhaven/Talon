import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class LoadFieldHandler extends OpCodeHandler{
    handle(thread:Thread){
        const instance = thread.currentMethod.pop();
        const fieldName = <string>thread.currentInstruction?.value!;

        const field = instance?.fields.get(fieldName);

        const value = field?.value;

        thread.log?.debug(`ld.field\t\t${instance?.typeName}::${fieldName} // ${value}`);

        thread.currentMethod.push(value!);

        return super.handle(thread);
    }
}