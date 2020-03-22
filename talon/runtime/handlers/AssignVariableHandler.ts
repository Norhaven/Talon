import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeInteger } from "../library/RuntimeInteger";

export class AssignVariableHandler extends OpCodeHandler{
    handle(thread:Thread){
        thread.log?.debug(".st.var");

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