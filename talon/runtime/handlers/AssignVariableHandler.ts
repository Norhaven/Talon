import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { OpCode } from "../../common/OpCode";
import { RuntimeBoolean } from "../library/RuntimeBoolean";

export class AssignVariableHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.Assign;

    handle(thread:Thread){

        const instance = thread.currentMethod.pop();
        const value = thread.currentMethod.pop();

        this.logInteraction(thread, instance, value);

        if (instance instanceof RuntimeString){
            instance.value = (<RuntimeString>value).value;
        } else if (instance instanceof RuntimeInteger){
            instance.value = (<RuntimeInteger>value).value;
        } else if (instance instanceof RuntimeBoolean){
            instance.value = (<RuntimeBoolean>value).value;
        } else {
            throw new RuntimeError("Encountered unsupported type on the stack");
        }

        return super.handle(thread);
    }
}