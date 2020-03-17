import { OpCodeHandler } from "../OpCodeHandler"
import { Thread } from "../Thread";

export class LoadThisHandler extends OpCodeHandler{
    handle(thread:Thread){
        const instance = thread.currentMethod.method?.actualParameters[0].value!;

        thread.currentMethod.push(instance);

        thread.log?.debug(`ld.this`);

        return super.handle(thread);
    }
}