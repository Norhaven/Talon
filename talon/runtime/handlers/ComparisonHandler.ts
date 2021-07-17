import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeBoolean } from "../library/RuntimeBoolean";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { RuntimeString } from "../library/RuntimeString";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class ComparisonHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.CompareEqual;

    handle(thread:Thread){

        var instance = thread.currentMethod.pop();
        var comparand = thread.currentMethod.pop();

        this.logInteraction(thread, instance, comparand);

        if (instance instanceof RuntimeString && comparand instanceof RuntimeString){
            var value = Memory.allocateBoolean(instance.value == comparand.value);
            thread.currentMethod.push(value);
        } else if (instance instanceof RuntimeInteger && comparand instanceof RuntimeInteger){
            var value = Memory.allocateBoolean(instance.value == comparand.value);
            thread.currentMethod.push(value);
        } else if (instance instanceof RuntimeBoolean && comparand instanceof RuntimeBoolean){            
            var value = Memory.allocateBoolean(instance.value === comparand.value);
            thread.currentMethod.push(value);
        } else {
            throw new RuntimeError(`Encountered type mismatch on stack during comparison: ${instance?.typeName} == ${comparand?.typeName}`);
        }

        return super.handle(thread);
    }
}