import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeError } from "../errors/RuntimeError";
import { OpCode } from "../../common/OpCode";

export class LoadInstanceHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.LoadInstance;

    handle(thread:Thread){

        const typeName = thread.currentInstruction?.value!;

        this.logInteraction(thread, typeName);
        
        if (typeName === "~it"){
            const subject = thread.currentPlace!;
            thread.currentMethod.push(subject);
        } else {
            throw new RuntimeError(`Unable to load instance for unsupported type '${typeName}'`);
        }

        return super.handle(thread);
    }
}