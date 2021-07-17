import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeError } from "../errors/RuntimeError";
import { Memory } from "../common/Memory";
import { OpCode } from "../../common/OpCode";

export class NewInstanceHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.NewInstance;

    handle(thread:Thread){
        const typeName = thread.currentInstruction?.value;

        this.logInteraction(thread, typeName);

        if (typeof typeName === "string"){
            const type = thread.knownTypes.get(typeName);

            if (!type){
                throw new RuntimeError("Unable to locate type");
            }

            const instance = Memory.allocate(type);

            thread.currentMethod.push(instance);
        }

        return super.handle(thread);
    }
}