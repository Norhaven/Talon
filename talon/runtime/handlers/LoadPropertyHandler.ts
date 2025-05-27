import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { MethodActivation } from "../MethodActivation";
import { Variable } from "../library/Variable";
import { InstanceCallHandler } from "./InstanceCallHandler";
import { LoadThisHandler } from "./LoadThisHandler";
import { EvaluationResult } from "../EvaluationResult";
import { OpCode } from "../../common/OpCode";
import { RuntimeError } from "../errors/RuntimeError";

export class LoadPropertyHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.LoadProperty;

    constructor(){
        super();
    }

    handle(thread:Thread){

        const fieldName = <string>thread.currentInstruction?.value!;

        const instance = thread.currentMethod.pop();

        if (!instance){
            throw new RuntimeError(`Unable to load property '${fieldName}' without an instance`);
        }

        const locationSpecificFieldName = `${fieldName}@${thread.currentPlace?.getType().name}`;

        const actualFieldName = instance.hasOrInheritsField(locationSpecificFieldName) ? locationSpecificFieldName : fieldName;

        const value = instance.getFieldValueByName(actualFieldName);
        const getField = instance.methods.get(`~get_${actualFieldName}`);

        this.logInteraction(thread, `${instance.typeName}::${actualFieldName}`, `{get=${getField != undefined}}`, '//', value);

        if (getField){
            thread.currentMethod.push(value);

            const loadThis = new LoadThisHandler();
            const result = loadThis.handle(thread);

            if (result != EvaluationResult.Continue){
                return result;
            }
            
            const handler = new InstanceCallHandler(getField.name);
            handler.handle(thread);

            //getField.actualParameters.push(new Variable("~value", field?.type!, value));

            //thread.activateMethod(getField);
        } else {
            thread.currentMethod.push(value);
        }

        return super.handle(thread);
    }
}