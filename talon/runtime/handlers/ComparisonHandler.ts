import { OpCode } from "../../common/OpCode";
import { List } from "../../library/List";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeBoolean } from "../library/RuntimeBoolean";
import { RuntimeDelegate } from "../library/RuntimeDelegate";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { RuntimeList } from "../library/RuntimeList";
import { RuntimeString } from "../library/RuntimeString";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { InstanceCallHandler } from "./InstanceCallHandler";

export class ComparisonHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.CompareEqual;

    handle(thread:Thread){

        var comparand = thread.currentMethod.pop();
        var instance = thread.currentMethod.pop();

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
        } else if (instance instanceof RuntimeList && comparand instanceof RuntimeString){
            thread.logReadable(`Checking list for '${comparand.value}'`);

            thread.currentMethod.push(comparand);
            thread.currentMethod.push(instance);

            var instanceCallHandler = new InstanceCallHandler(List.contains);
            return instanceCallHandler.handle(thread);
        } else {
            throw new RuntimeError(`Encountered type mismatch on stack during comparison: ${instance?.typeName} == ${comparand?.typeName}`);
        }

        return super.handle(thread);
    }
}