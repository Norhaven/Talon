import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class LoadLocalHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.LoadLocal;

    handle(thread:Thread){

        const localName = thread.currentInstruction?.value!;
        const parameter = thread.currentMethod.method?.actualParameters.find(x => x.name == localName);

        thread.currentMethod.push(parameter?.value || Memory.allocateEmpty());

        this.logInteraction(thread, localName, '//', parameter?.value);

        return super.handle(thread);
    }
}