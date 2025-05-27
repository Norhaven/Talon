import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { Memory } from "../common/Memory";
import { OpCode } from "../../common/OpCode";
import { RuntimeString } from "../library/RuntimeString";

export class TypeOfHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.TypeOf;

    handle(thread:Thread){
        let typeName = <string>thread.currentInstruction?.value!;

        this.logInteraction(thread, typeName);
        
        const instance = thread.currentMethod.pop();
        
        if (!typeName){
            typeName = (<RuntimeString>thread.currentMethod.pop()).value;
        }

        const isType = instance?.isTypeOf(typeName) || false;
        const result = Memory.allocateBoolean(isType);

        thread.currentMethod.push(result);
        
        return super.handle(thread);
    }
}