import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class GetTypeNameHandler extends OpCodeHandler{
    public code: OpCode = OpCode.GetTypeName;

    handle(thread:Thread){

        const instance = thread.currentMethod.pop();
        const typeName = instance?.typeName || "";

        thread.currentMethod.push(Memory.allocateString(typeName));
        
        return super.handle(thread);
    }
}