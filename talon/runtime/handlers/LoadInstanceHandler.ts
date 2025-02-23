import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeError } from "../errors/RuntimeError";
import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";

export class LoadInstanceHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.LoadInstance;

    handle(thread:Thread){

        const typeName = thread.currentInstruction?.value!;

        this.logInteraction(thread, typeName);
        
        if (typeName === "~it"){
            const subject = thread.currentPlace!;
            thread.currentMethod.push(subject);
        } else {
            const instance = Memory.findOrAddInstance(<string>typeName);

            if (!instance){
                throw new RuntimeError(`Unable to load instance for unsupported type '${typeName}'`);
            }

            thread.currentMethod.push(instance);
        }

        return super.handle(thread);
    }
}