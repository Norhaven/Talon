import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class LocalExistsHandler extends OpCodeHandler{
    public code: OpCode = OpCode.LocalExists;

    handle(thread:Thread){

        this.logInteraction(thread);

        const localName = thread.currentInstruction?.value;
        const parameter = thread.currentMethod.method?.actualParameters.find(x => x.name == localName);

        const exists = Memory.allocateBoolean(!!parameter);

        thread.currentMethod.push(exists);

        return super.handle(thread);
    }
}