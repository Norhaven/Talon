import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { Memory } from "../common/Memory";
import { OpCode } from "../../common/OpCode";

export class TypeOfHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.TypeOf;

    handle(thread:Thread){
        const typeName = <string>thread.currentInstruction?.value!;

        this.logInteraction(thread, typeName);
        
        const instance = thread.currentMethod.pop();

        const isType = instance?.typeName === typeName;
        const result = Memory.allocateBoolean(isType);

        thread.currentMethod.push(result);
        
        return super.handle(thread);
    }
}