import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeError } from "../errors/RuntimeError";
import { OpCode } from "../../common/OpCode";

export class LoadStringHandler extends OpCodeHandler{
    protected code: OpCode = OpCode.LoadString;

    handle(thread:Thread){
        const value = thread.currentInstruction!.value;

        this.logInteraction(thread, value);

        if (typeof value === "string"){
            const stringValue = new RuntimeString(value);
            thread.currentMethod.push(stringValue);
        } else {
            throw new RuntimeError("Expected a string");
        }

        return super.handle(thread);
    }
}