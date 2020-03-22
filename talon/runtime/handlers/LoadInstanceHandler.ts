import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeError } from "../errors/RuntimeError";

export class LoadInstanceHandler extends OpCodeHandler{
    handle(thread:Thread){

        const typeName = thread.currentInstruction?.value!;

        if (typeName === "~it"){
            const subject = thread.currentPlace!;
            thread.currentMethod.push(subject);

            thread.log?.debug(".ld.curr.place");
        } else {
            throw new RuntimeError(`Unable to load instance for unsupported type '${typeName}'`);
        }

        return super.handle(thread);
    }
}