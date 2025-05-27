import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { OpCode } from "../../common/OpCode";
import { RuntimeBoolean } from "../library/RuntimeBoolean";
import { RuntimeWorldObject } from "../library/RuntimeWorldObject";
import { RuntimeAny } from "../library/RuntimeAny";
import { RuntimeVariableReference } from "../library/RuntimeVariableReference";
import { Event } from "./internal/Event";
import { EventType } from "../../common/EventType";

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
        } else if (instance instanceof RuntimeVariableReference){

            if (!instance.value){
                throw new RuntimeError(`Unable to set undefined field '${instance.typeName}' to '${value}'`);
            }

            if (!value){
                throw new RuntimeError(`Unable to set field '${instance.value.name}' to an undefined value`);
            }

            instance.value.value = value;

            Event.using(thread).raiseContextual(EventType.ValueIsSet, instance.enclosingType!, value);
        } else {
            throw new RuntimeError("Encountered unsupported type on the stack");
        }

        return super.handle(thread);
    }
}