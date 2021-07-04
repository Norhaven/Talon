import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { OpCode } from "../../common/OpCode";

export class AssignVariableHandler extends OpCodeHandler{
    protected code: OpCode = OpCode.Assign;

    handle(thread:Thread){
        this.logInteraction(thread);

        const instance = thread.currentMethod.pop();
        const value = thread.currentMethod.pop();

        if (instance instanceof RuntimeString){
            instance.value = (<RuntimeString>value).value;
        } else if (instance instanceof RuntimeInteger){
            instance.value = (<RuntimeInteger>value).value;
        } else {
            throw new RuntimeError("Encountered unsupported type on the stack");
        }

        return super.handle(thread);
    }
}